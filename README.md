# ![Icon](/src/Images/Walkie Talkie Radio-96.png?raw=true "Hash Talkie") HashTalkie
A simple library for communication between web page and cross-site iframe.

註：前行400公尺有中文說明

When to use?
-----------

When the web page use a iframes to embed a web page from another site, cross-site scripting and accessing elements are forbidden due to [Same Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

Passing messages by changing the fragment identifier part of each other's URL (location.hash) is a simple but effective way to communicate with cross-site pages.

The biggest advantage of communicate via location.hash is that it is widely supported by browsers, even the oldest IE6. 

Hash Talkie is a simple library to provide basic handshaking, acknowledgment, long message spliting, message received event.  It can help you talk with cross-site page with several lines of code. 

How to use?
-----------

Prepare a container web page, include hashTalkie.js, add a iframe and assign the src url appending with current location.href.  
Construct the hashTalkie instance with iframe's id as argument.  

Use setChannel() to assign iframe's url and provide a event handler for receiving message from ifrarme. 

When the iframe's hashTalkie is ready, onIFrameReady event will be triggered and now you can send message to iframe. 

```JavaScript
        document.getElementById("frmChild").src =
            frameUrl + "#" + location.href;

        var ht = new hashTalkie("frmChild");
        ht.onIFrameReady = function () {
            ht.sendMessage("IFrame is ready");
        };
        ht.setChannel(frameUrl, function (msg) {
            alert("Message from Child: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };
```
In iframe side, exract parent url from location.hash first, then create a hashTalkie instance, 
setChannel() to give parent page's url and message event handler, that's all.

````JavaScript
        var parentUrl = location.hash.replace(/#/g, "");
        var ht = new hashTalkie();
        ht.setChannel(parentUrl, function (msg) {
            alert("Message from Parent: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };
````

Here is the [live demo](http://htmlpreview.github.io/?https://github.com/darkthread/HashTalkie/master/src/Htmls/parent.html), have fun!

Known Issues
------------

* The location.hash is used for message exchange, so you wil lost history forward/backword function.  You can put the parent page into a iframe to resolve the issue.
* Long message will be splited in 512 bytes each packet and sent in one packet / 55ms. Sending 10K string will cost more than one second, I guess it's fast enough. You can change timerInterval property to make it faster.   

中文說明
=======

# ![Icon](/src/Images/Walkie Talkie Radio-96.png?raw=true "Hash Talkie") Hash對講機
跨站台IFrame網頁訊息傳送簡易程式庫

應用場合
-----------

當網頁以IFrame內嵌來自其他站台網頁時，受限於[同源政策](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)，無法使用JavaScript存取IFrame網頁DOM或與其溝通。

透過修改IFrame或父網頁URL#後方參數(location.hash)傳遞訊息是種簡單卻有效的跨站台網頁溝通方式，其中最大的好處是能通吃各種瀏覽器，連最古老的IE6也能搞定。

Hash Talkie是一個簡單的程式庫，提供基本的交握協調、接收確認、長訊息分割、訊息接收事件等機制，協助你用少量程式完成跨站台IFrame網頁溝通

使用方法
-----------

準備一個容器網頁，引用hashTalkie.js，加入IFrame，指定其URL並附上目前location.href，傳入IFrame ID做為參數建立Instance。  

以setChannel()指定IFrame URL並提供接收訊息的事件處理函式。

在IFrame hashTalkie也啟動設定妥當後，onIFrameReady事件會被觸發，此時即可開對IFrame傳送訊息。

```JavaScript
        document.getElementById("frmChild").src =
            frameUrl + "#" + location.href;

        var ht = new hashTalkie("frmChild");
        ht.onIFrameReady = function () {
            ht.sendMessage("IFrame is ready");
        };
        ht.setChannel(frameUrl, function (msg) {
            alert("Message from Child: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };
```

在IFrame端，先由URL取出父網頁URL，接著建立hashTalkie Instance，以setChannel()設定父網頁URL並提供訊息接收事件函式，搞定！

````JavaScript
        var parentUrl = location.hash.replace(/#/g, "");
        var ht = new hashTalkie();
        ht.setChannel(parentUrl, function (msg) {
            alert("Message from Parent: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };
````

這裡有[Live Demo](http://htmlpreview.github.io/?https://github.com/darkthread/HashTalkie/master/src/Htmls/parent.html)可以試玩，Have Fun!

已知問題
------------

* 由於location.hash被用於資料傳輸，瀏覽器回上頁功能將因此失效，將父網頁也內嵌到IFrame內可避免問題。
* 長訊息會以512 Bytes為單位切割成多個封包並以55ms一個封包的頻率傳送，傳送10K資料耗時將超過1秒，如有需要可調整timerInterval屬性加快。

Icon from [icons8.com](http://icons8.com)
