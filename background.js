function noticeChange(flag){
    if(flag){
        turnOn()
    }else{
        turnOff()
    }
}

function turnOn(){
    chrome.browserAction.setBadgeText({ text: "ON" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 100] });
    chrome.browserAction.setTitle({ title: "ON" });
}
function turnOff(){
    chrome.browserAction.setBadgeText({ text: "OFF" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 100] });
    chrome.browserAction.setTitle({ title: "OFF" });
}

// 拡張機能のON,OFF設定をストレージから取ってくる　defaultはON
var extension_flag = true;
var default_data = {'key': true };
chrome.storage.sync.get(default_data, function (value) {
    extension_flag = value.key;
  
    noticeChange(extension_flag);
    
    chrome.browserAction.onClicked.addListener(function(){
        //設定を切り替え、それを保存する
        extension_flag = !extension_flag
        chrome.storage.sync.set({'key': extension_flag}, function () {
            // すべてのタブにメッセージを送信する
            chrome.tabs.query({}, function(tabs){
                tabs.forEach(function(tab){
                    chrome.tabs.sendMessage(tab.id, extension_flag);  
                    }
                )
            });
            noticeChange(extension_flag)
        });
    });    
});

