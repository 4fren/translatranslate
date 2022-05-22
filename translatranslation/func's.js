var results;

const glot = new Glottologist();

function translation(destination, target, targetLang){
    var d;
    //console.log(destination.value, destination.textContent)
    if(destination.value != undefined){
        d = destination.value;
    }else{
        d = destination.textContent;
    };
    glot.gTranslate(d, targetLang).then(result => {
        target.textContent = result;
        
    }).catch(result => {
        showBox_confirmation();
    });
};

function toTranslate(){
    var tT = document.getElementById("selectNumber");
    var sR = document.getElementsByName("radio");
    var lL = document.getElementsByClassName("selectboxes");

    var translateTimes = tT.value;

    var selectedRadio;
    for (var i=0; i<sR.length; i++){
        if (sR[i].checked == true){
            selectedRadio = sR[i].value;
        };
    };

    var langList = [];
    for (var i=0; i<lL.length; i++){
        langList.push(lL[i].value);
    };

    var textarea = document.getElementById("wordInput");
    var elements = document.getElementsByClassName("ps");

    if(wordInput.value != ""){
        results = [];

        for (var i=0; i<lL.length; i++){
            resetResultP(lL[i].id);
        };

        localStorage.setItem('tT_history', translateTimes);
        localStorage.setItem('sR_history', selectedRadio);
        localStorage.setItem('lL_history', langList);

        showBox_translating();

        if (selectedRadio == 0){
            for (var i=0; i<translateTimes; i++){
                translation(textarea, elements[i], langList[i]);
            };

            var timer1 = setInterval(function(){
                results = [];
                for (var i=0; i<elements.length; i++){
                    results.push(elements[i].textContent);
                };

                if (results.indexOf("") < 0){
                    closeBox_translating();
                    clearInterval(timer1);

                    localStorage.setItem('result_history', results);
                };
            },100);
        }else if (selectedRadio == 1){
            translation(textarea, elements[0], langList[0]);

            var limit = 1;
            var timer2 = setInterval(function(){
                if (limit < translateTimes && elements[limit-1].textContent != ""){
                    translation(elements[limit-1], elements[limit], langList[limit]);
                    limit++;
                };

                if (elements[elements.length-1].textContent != ""){
                    clearInterval(timer2);
                    closeBox_translating();

                    for (var i=0; i<elements.length; i++){
                        results.push(elements[i].textContent);
                    };

                    localStorage.setItem('result_history', results);
                };
            },1000);
        };
    };
};

function getNumber(){
    var selectNumber = document.getElementById("selectNumber")
    var count = selectNumber.value;
    //console.log(count);

    return count;
};

function makeList(count){
    var list = Array(count);
    for (var l=0; l<count; l++) {
        list[l] = ""
    };
    //console.log(list);

    return list;
};

function copy(button_id){
    var int_id = button_id.replace("copyButton", "");
    //console.log(int_id)
    // コピー対象のpタグオブジェクトを取得する.
    var resultP = document.getElementById("resultP" + int_id);
    // コピー内容を選択する.
    let range = document.createRange();
    range.selectNodeContents(resultP);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    if(selection.toString()) {
        showBox_successCopy()
    }

    // 選択したものをコピーする.
    document.execCommand('copy');
    // コピー内容の選択を解除する.
    selection.removeAllRanges();
};

var timerId1;
var timerId2;
var timerId3;

// ボックスを表示して、タイマーを開始
function showBox_successCopy(){
    document.getElementById("temporaryBox_message").innerText = "コピーしました。";
    timerId1 = setTimeout(closeBox_successCopy, 2000); // タイマーを開始
    
    disabledTrue();
};

// ボックスを消して、タイマーを終了
function closeBox_successCopy(){
    document.getElementById("temporaryBox_message").innerText = "";
    clearTimeout(timerId1); // タイマーを終了
    
    disabledFalse();
};

// ボックスを表示して、タイマーを開始
function showBox_translating(){
    document.getElementById("temporaryBox_message").innerText = "翻訳しています……";
    //timerId2 = setTimeout(closeBox_translating, 20000); // タイマーを開始
    
    disabledTrue();
};

// ボックスを消して、タイマーを終了
function closeBox_translating(){
    document.getElementById("temporaryBox_message").innerText = "";
    //clearTimeout(timerId2); // タイマーを終了
    
    disabledFalse();
};

function showBox_confirmation(){
    document.getElementById("temporaryBox_message").innerText = "エラーが発生しました。もう一度お試しください。";
    timerId3 = setTimeout(closeBox_confirmation, 2000); // タイマーを開始
};

function closeBox_confirmation(){
    document.getElementById("temporaryBox_message").innerText = "";
    clearTimeout(timerId3); // タイマーを終了
};

function disabledTrue(){
    var all_button = document.getElementsByTagName("button");
    for (var i=0; i<all_button.length; i++) {
        all_button[i].disabled = true;// 全てのボタンを無効化
    };

    var all_select = document.getElementsByTagName("select");
    for (var i=0; i<all_select.length; i++) {
        all_select[i].disabled = true;
    };

    var all_input = document.getElementsByTagName("input");
    for (var i=0; i<all_input.length; i++){
        all_input[i].disabled = true;
    };
};

function disabledFalse(){
    var all_button = document.getElementsByTagName("button");
    for (var i=0; i<all_button.length; i++) {
        all_button[i].disabled = false;// 全てのボタンを有効化
    };

    var all_select = document.getElementsByTagName("select");
    for (var i=0; i<all_select.length; i++) {
        all_select[i].disabled = false;
    };

    var all_input = document.getElementsByTagName("input");
    for (var i=0; i<all_input.length; i++){
        all_input[i].disabled = false;
    };
};

function scroll_control(event) {
    event.preventDefault();
};

function no_scroll(){
    document.addEventListener("mousewheel", scroll_control, {passive: false});
    //document.addEventListener("touchmove", scroll_control, {passive: false});
};

function return_scroll(){
    document.removeEventListener("mousewheel", scroll_control, {passive: false});
    //document.removeEventListener('touchmove', scroll_control, {passive: false});
};

var thisAttrId;
var thisAttrClass;

$("#selectNumber").mouseover(function() {
    thisAttrId = $(this).attr("id");
    no_scroll();
});

$("#selectNumber").mouseout(function() {
    thisAttrId = "";
    return_scroll();
});

// リストボックスの選択の操作
function handle(delta) {
    //console.log(thisAttrId);
    //console.log(thisAttrClass);
    if (thisAttrId == "selectNumber") {
        if (event.preventDefault) {
            no_scroll();
        }
        var ddl = document.getElementById(thisAttrId);
        if (delta < 0) {
            if (ddl.selectedIndex < ddl.options.length - 1) {
            ddl.selectedIndex += 1;
            };
        } else {
            if (ddl.selectedIndex > 0) {
            ddl.selectedIndex -= 1;
            };
        };
        setting()
    } else if (thisAttrClass == "selectboxes") {
        if (event.preventDefault) {
            no_scroll();
        }
        var ddl = document.getElementById(thisAttrId);
        if (delta < 0) {
            if (ddl.selectedIndex < ddl.options.length - 1) {
            ddl.selectedIndex += 1;
            };
        } else {
            if (ddl.selectedIndex > 0) {
            ddl.selectedIndex -= 1;
            };
        };
        if (ddl.id != "selectbox10"){
            resetResultP(thisAttrId);
        };
    } else {
        return_scroll();
    };
};

window.onmousewheel = function(){
    if(event.wheelDelta > 0){
        //console.log(event.wheelDelta);
    } else {
        //console.log(event.wheelDelta);
    }
    handle(event.wheelDelta);
};

function setting(){
    count = getNumber();
    //console.log(count)
    createSelectBox(count);
    changeRadio1(count);
    changeRadio2(count);
};

//連想配列の配列
let arr = [
    {val:"en", txt:"英語"},
    {val:"ja", txt:"日本語"},
    {val:"ko", txt:"韓国語"},
    {val:"zh-cn", txt:"中国語（簡体字）"},
    {val:"zh-tw", txt:"中国語（繁体字）"},
    {val:"is", txt:"アイスランド語"},
    {val:"ga", txt:"アイルランド語"},
    {val:"az", txt:"アゼルバイジャン語"},
    {val:"af", txt:"アフリカーンス語"},
    {val:"am", txt:"アムハラ語"},
    {val:"ar", txt:"アラビア語"},
    {val:"sq", txt:"アルバニア語"},
    {val:"hy", txt:"アルメニア語"},
    {val:"it", txt:"イタリア語"},
    {val:"yi", txt:"イディッシュ語"},
    {val:"ig", txt:"イボ語"},
    {val:"id", txt:"インドネシア語"},
    {val:"cy", txt:"ウェールズ語"},
    {val:"uk", txt:"ウクライナ語"},
    {val:"uz", txt:"ウズベク語"},
    {val:"ur", txt:"ウルドゥー語"},
    {val:"et", txt:"エストニア語"},
    {val:"eo", txt:"エスペラント"},
    {val:"nl", txt:"オランダ語"},
    {val:"kk", txt:"カザフ語"},
    {val:"kn", txt:"カンナダ語"},
    {val:"gl", txt:"ガリシア語"},
    {val:"ky", txt:"キルギス語"},
    {val:"el", txt:"ギリシア語"},
    {val:"km", txt:"クメール語"},
    {val:"ku", txt:"クルド語"},
    {val:"hr", txt:"クロアチア語"},
    {val:"gu", txt:"グジャラート語"},
    {val:"ka", txt:"グルジア語"},
    {val:"xh", txt:"コサ語"},
    {val:"co", txt:"コルシカ語"},
    {val:"sm", txt:"サモア語"},
    {val:"sn", txt:"ショナ語"},
    {val:"sd", txt:"シンド語"},
    {val:"si", txt:"シンハラ語"},
    //{val:"jv", txt:"ジャワ語"},
    {val:"sv", txt:"スウェーデン語"},
    {val:"gd", txt:"スコットランド・ゲール語"},
    {val:"es", txt:"スペイン語"},
    {val:"sk", txt:"スロバキア語"},
    {val:"sl", txt:"スロベニア語"},
    {val:"sw", txt:"スワヒリ語"},
    {val:"su", txt:"スンダ語"},
    {val:"zu", txt:"ズールー語"},
    {val:"sr", txt:"セルビア語"},
    {val:"st", txt:"ソト語"},
    {val:"so", txt:"ソマリ語"},
    {val:"th", txt:"タイ語"},
    {val:"tl", txt:"タガログ語"},
    {val:"tg", txt:"タジク語"},
    {val:"ta", txt:"タミル語"},
    {val:"cs", txt:"チェコ語"},
    {val:"ny", txt:"チェワ語"},
    {val:"te", txt:"テルグ語"},
    {val:"da", txt:"デンマーク語"},
    {val:"tr", txt:"トルコ語"},
    {val:"de", txt:"ドイツ語"},
    {val:"ne", txt:"ネパール語"},
    {val:"no", txt:"ノルウェー語"},
    {val:"ht", txt:"ハイチ語"},
    {val:"ha", txt:"ハウサ語"},
    {val:"hu", txt:"ハンガリー語"},
    {val:"eu", txt:"バスク語"},
    {val:"ps", txt:"パシュトー語"},
    {val:"pa", txt:"パンジャーブ語"},
    {val:"hi", txt:"ヒンディー語"},
    {val:"fi", txt:"フィンランド語"},
    {val:"fr", txt:"フランス語"},
    {val:"bg", txt:"ブルガリア語"},
    {val:"he", txt:"ヘブライ語"},
    {val:"vi", txt:"ベトナム語"},
    {val:"be", txt:"ベラルーシ語"},
    {val:"bn", txt:"ベンガル語"},
    {val:"fa", txt:"ペルシア語"},
    {val:"bs", txt:"ボスニア語"},
    {val:"pt", txt:"ポルトガル語"},
    {val:"pl", txt:"ポーランド語"},
    {val:"mi", txt:"マオリ語"},
    {val:"mk", txt:"マケドニア語"},
    {val:"mg", txt:"マダガスカル語"},
    {val:"ml", txt:"マラヤーラム語"},
    {val:"mr", txt:"マラーティー語"},
    {val:"mt", txt:"マルタ語"},
    {val:"ms", txt:"マレー語"},
    {val:"my", txt:"ミャンマー語"},
    {val:"mn", txt:"モンゴル語"},
    {val:"yo", txt:"ヨルバ語"},
    {val:"la", txt:"ラテン語"},
    {val:"lv", txt:"ラトビア語"},
    {val:"lo", txt:"ラーオ語"},
    {val:"lt", txt:"リトアニア語"},
    {val:"lb", txt:"ルクセンブルク語"},
    {val:"ro", txt:"ルーマニア語、モルドバ語[1]"},
    {val:"ru", txt:"ロシア語"},
    {val:"fy", txt:"西フリジア語"},
    {val:"ca", txt:"カタルーニャ語、バレンシア語"}
];

function createSelectBox(count){
    var select = document.getElementsByClassName("selectboxes");
    var selectList = makeList(getNumber());
    for (var d=0; d<select.length; d++) {
        selectList[d] = select[d].value;
    };

    var p = document.getElementsByClassName("ps");
    var resultPList = makeList(getNumber());
    for (var d=0; d<p.length; d++) {
        resultPList[d] = p[d].innerText;
    };

    //console.log(selectList);
    //console.log(resultPList);
    //console.log(result);

    var div_div = document.getElementById("div_div");

    while (div_div.firstChild) {
        div_div.removeChild(div_div.firstChild);
    };

    for (var ds=0; ds<count; ds++) {
        var div = document.createElement('div');
        var underArrowP = document.createElement('p');
        var selectbox = document.createElement('select');
        var rightArrowP = document.createElement('p');
        var resultP = document.createElement('p');
        var speakButton = document.createElement('button');
        var copyButton =document.createElement('button');

        var checkRadio2Flag = checkRadio2();

        if (checkRadio2Flag == true) {
            var p_class = "underArrowP";
            underArrowP.setAttribute("class", p_class);
            underArrowP.innerText = "↓　↓　↓";
            div_div.appendChild(underArrowP);
        }

        var div_id = "div" + ds;
        var div_class = "div_selectbox";
        div.setAttribute("id", div_id);
        div.setAttribute("class", div_class);

        div_div.appendChild(div);

        var div_selectbox = document.getElementById(div_id);

        var selectbox_id = "selectbox" + ds;
        var selectbox_class = "selectboxes";
        var selectbox_onchange = "resetResultP(this.id)";
        selectbox.setAttribute("id", selectbox_id);
        selectbox.setAttribute("class", selectbox_class);
        selectbox.setAttribute("onchange", selectbox_onchange);

        var p_id = "rightArrowP" + ds;
        var p_class = "rightArrowP";
        rightArrowP.setAttribute("id", p_id);
        rightArrowP.setAttribute("class", p_class);
        rightArrowP.innerText = "→";

        var p_id = "resultP" + ds;
        var p_class = "ps";
        var p_translate = "no";
        resultP.setAttribute("id", p_id);
        resultP.setAttribute("class", p_class);
        resultP.setAttribute("translate", p_translate);
        resultP.innerText = "";

        var button_id = "speakButton" + ds;
        var button_class = "speakButton";
        var button_type = "button";
        var button_onclick = "startSpeak(this.id)";
        speakButton.setAttribute("id", button_id);
        speakButton.setAttribute("class", button_class);
        speakButton.setAttribute("type", button_type);
        speakButton.setAttribute("onclick", button_onclick);
        speakButton.innerText = "再生";

        var button_id = "copyButton" + ds;
        var button_class = "copyButton";
        var button_type = "button";
        var button_onclick = "copy(this.id)";
        copyButton.setAttribute("id", button_id);
        copyButton.setAttribute("class", button_class);
        copyButton.setAttribute("type", button_type);
        copyButton.setAttribute("onclick", button_onclick);
        copyButton.innerText = "コピー";

        div_selectbox.appendChild(selectbox);
        div_selectbox.appendChild(rightArrowP);
        div_selectbox.appendChild(resultP);
        //div_selectbox.appendChild(speakButton);
        div_selectbox.appendChild(copyButton);
    };
    
    var select = document.getElementsByClassName("selectboxes");
    
    for (var add=0; add<select.length; add++) {
        //連想配列をループ処理で値を取り出してセレクトボックスにセットする
        for (var i=0; i<arr.length; i++) {
            let op = document.createElement("option");
            op.value = arr[i].val;  //value値
            op.text = arr[i].txt;   //テキスト値
            select[add].appendChild(op);
        };
    };

    setLangSelectboxesValues(selectList);
    
    setResult(resultPList);
    //setResult(result);

    $(".selectboxes").mouseover(function() {
        thisAttrId = $(this).attr("id");
        thisAttrClass = $(this).attr("class");
        no_scroll();
    });

    $(".selectboxes").mouseout(function() {
        thisAttrId = "";
        thisAttrClass = "";
        return_scroll();
    });
};

function changeRadio1(count){
    var message = count + "言語に翻訳";

    var label1 = document.getElementById("label1");
    label1.innerText = message;
    //console.log(message);
};

function changeRadio2(count){
    var message = count + "回翻訳";

    var lavel2 = document.getElementById("label2");
    label2.innerText = message;
    //console.log(message);
};

function history(){
    var tT_history = localStorage.getItem("tT_history");
    var sR_history = localStorage.getItem("sR_history");
    var lL_history = localStorage.getItem("lL_history").split(",");
    var result_history = localStorage.getItem("result_history").split(",");
    console.log(tT_history);
    console.log(sR_history);
    console.log(lL_history);
    console.log(result_history);

    setValue(tT_history, sR_history, lL_history, result_history);
};

function setLangSelectboxesValues(langList){
    var langSelectboxes = document.getElementsByClassName("selectboxes");

    for (var i=0; i<getNumber(); i++) {
        if (langList[i] != ""){
            langSelectboxes[i].value = langList[i];
        };
    };
};

function setResult(result){
    var ps = document.getElementsByClassName("ps");

    for (var i=0; i<ps.length; i++) {
        ps[i].innerText = result[i];
        if (ps[i].innerText == "undefined") {
            ps[i].innerText = "";
        };
    };
};

function setValue(translateTimes, selectedRadio, langList, result){
    var sN = document.getElementById("selectNumber");
    sN.value = translateTimes;

    createSelectBox(translateTimes);
    setResult(result);
    changeRadio1(translateTimes);
    changeRadio2(translateTimes);
    
    var form1Radio = document.getElementsByName("radio");
    form1Radio[selectedRadio].checked = true;

    setting();

    setLangSelectboxesValues(langList);
};

function checkRadio2(){
    var form1Radio = document.getElementsByName("radio");

    var checkRadio2Flag = false;

    if (form1Radio[1].checked == true) {
        checkRadio2Flag = true;
    };

    return checkRadio2Flag;
};

function resetResultP(Id){
    var currentSelectedLanguage = document.getElementsByClassName("selectboxes");
    var currentResultP = document.getElementsByClassName("ps");
    
    for (var i=0; i<currentSelectedLanguage.length-1; i++) {
        if (currentSelectedLanguage[i].id == Id) {
            //console.log(i);
            currentResultP[i].innerText = "";
        };
    };
};

function translateTimer(){
    setting();

    if (document.getElementById("wordInput").value != ""){
        showBox_translating();
    };
};

function randomSetting(){
    var currentNumber = Number(document.getElementById("selectNumber").value);

    var randomList = [];

    for (var i=0; i<currentNumber; i++) {
        var random = Math.floor(Math.random() * arr.length);
        //console.log(random)
        randomList.push(arr[random].val);
    };

    //console.log(randomList);

    setLangSelectboxesValues(randomList);

    var selectbox = document.getElementsByClassName("selectboxes");
    for (var i=0; i<selectbox.length; i++){
        resetResultP(selectbox[i].id);
    };
};

function startSpeak(Id){
    var speakButton = document.getElementsByClassName("speakButton");
    var selectBoxes = document.getElementsByClassName("selectboxes");
    var resultP = document.getElementsByClassName("ps")

    for (var i=0; i<speakButton.length; i++) {
        if (speakButton[i].id == Id) {
            //console.log(i);
            speak(selectBoxes[i].value, resultP[i].innerText);
        };
    };
};

function speak(lang, sentence){
    if ('speechSynthesis' in window) {
        //alert("このブラウザは音声合成に対応しています。🎉");
        // 発言を作成
        const uttr = new SpeechSynthesisUtterance(sentence);
        uttr.lang = lang;
        // 発言を再生 (発言キューに発言を追加)
        speechSynthesis.speak(uttr);
    } else {
        alert("このブラウザは音声合成に対応していません。😭");
    };
};

var lang;

function voiceInput(){
    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;

    if ('SpeechRecognition' in window) {
        var wordInput = document.getElementById("wordInput");

        // ユーザのブラウザは音声合成に対応しています。
        const recognition = new SpeechRecognition();

        
        //console.log('language : ', lang);

        //recognition.continuous = true;

        recognition.lang = lang;

        recognition.onresult = (event) => {
            //alert(event.results[0][0].transcript);
            wordInput.innerText = event.results[0][0].transcript;
        };

        recognition.start();
    } else {
        // ユーザのブラウザは音声合成に対応していません。
        alert("このブラウザは音声入力に対応していません。😭");
    };
};

document.getElementById("close").addEventListener('click', function(){
    lang = document.getElementById("selectbox10").value;
    console.log(lang);

    voiceInput();
});

const open = document.getElementById('inputButton');
const close = document.getElementById('close');
const modal = document.getElementById('modal');
const mask = document.getElementById('mask');

open.addEventListener('click', function () {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
});

close.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
});

mask.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
});

setting();
