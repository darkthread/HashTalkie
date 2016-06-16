# ![Icon](/src/Images/Walkie Talkie Radio-96.png?raw=true "Hash Talkie") HashTalkie
A simple library for communication between web page and cross-site iframe.

When to use?
-----------
When the web page use a iframes to embed a web page from another site, cross-site scripting and accessing elements are forbidden due to [Same Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).
Passing messages by changing the fragment identifier part of each other's URL (location.hash) is a simple but effective way to communicate with cross-site pages.
The biggest advantage of communicate by location.hash is that it is widely supported by browsers, even the oldest IE6.
Hash Talkie is a simple library to provide basic handshaking, acknowledgment, long message spliting, message received event.  It can help you talk with cross-site page 
with several lines of code. 

How to use?
-----------
Prepare a container web page, include hashTalkie.js, add a iframe and assign the src url appending with current location.href.  
Construct the hashTalkie instance with iframe's id as argument.  

Use setChannel() to assign iframe's url and provide a event handler for receiving message from ifrarme. 

When the iframe's hashTalkie is ready, onIFrameReady event will be triggered and you can send message to iframe. 

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
