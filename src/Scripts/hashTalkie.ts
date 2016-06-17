/*
HashTalkie - A simple messaging protocol between parent window and iframe via locaion.hash
by darkthread, 2016-06

Usage
========

Parent.html

        var frameUrl = "http://portal.dev.net/oasis/htmls/child.html";
        document.getElementById("frmChild").src =
            frameUrl + "#" + location.href;

        var ht = new hashTalkie("frmChild");
        ht.setChannel(frameUrl, function (msg) {
            alert("Message from Child: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };

Child.html

        var parentUrl = location.hash.replace(/#/g, "");
        var ht = new hashTalkie();
        ht.setChannel(parentUrl, function (msg) {
            alert("Message from Parent: " + msg);
        });
        document.getElementById("btnSend").onclick = function () {
            ht.sendMessage(document.getElementById("txtMsg").value);
        };


*/
class hashTalkie {
    targetUrl: string;
    containerMode: boolean = false;
    iframeElement: HTMLIFrameElement;
    msgBuffer: string[] = [];
    /** Event afer complete message received */
    onMessage: (message: string) => void;
    /** Event when target iframe is ready */
    onIFrameReady: () => void;
    private setTargetHash(data: string) {
        if (!this.targetUrl) {
            alert("Please setChannel() first");
            return;
        }
        if (this.containerMode)
            this.iframeElement.src = this.targetUrl + "#" + data;
        else
            parent.window.location = <any>(this.targetUrl + "#" + data);
    }
    /** is $BODY acknowledged? */
    acked: boolean = false;
    /** is target ready? */
    ready: boolean = false;
    sendMessage(message: string) {
        var self = this;
        var buffer = [], PACKET_SIZE = 512;
        var n = Math.floor(message.length / PACKET_SIZE);
        var r = message.length % PACKET_SIZE;
        for (var i = 0; i < n; i++) {
            buffer.push(message.substr(i * PACKET_SIZE, PACKET_SIZE));
        }
        if (r) {
            buffer.push(message.substr(n * PACKET_SIZE, r));
        }
        self.acked = true;
        var seq = Math.random();
        self.setTargetHash("$MSG-" + seq);
        var hnd = setInterval(() => {
            if (!self.acked) return;
            if (buffer.length == 0) {
                self.setTargetHash("$OK-" + seq);
                clearInterval(hnd);
                return;
            }
            self.acked = false;
            self.setTargetHash("$BODY" + buffer.shift());
        }, 10);
    }

    sendAck() {
        this.setTargetHash("$ACK");
    }

    setChannel(targetUrl: string, onMessage: (message: string) => void) {
        var self = this;
        self.ready = false;
        self.targetUrl = targetUrl.split('#')[0];
        self.onMessage = onMessage;
        if (!self.containerMode) self.setTargetHash("$READY");
    }

    static instance: hashTalkie = null;

    msgSeq: string;

    constructor(iframeId?: string) {
        var self = this;
        if (hashTalkie.instance) {
            alert("hashTalkie instance already exists.");
            return;
        }
        hashTalkie.instance = this;

        if (iframeId) {
            self.iframeElement = <HTMLIFrameElement>document.getElementById(iframeId);
            if (!self.iframeElement) alert("IFrame [" + iframeId + "] not found!");
            self.containerMode = true;
        }
        else {
            self.containerMode = false;
        }



        function onHashChange(ev) {
            //console && console.log(location.href);
            var hash = location.hash.replace(/^#/, "");
            location.hash = "";
            if (hash.indexOf("$MSG") == 0) {
                self.msgBuffer = [];
                self.msgSeq = hash.split('-')[1];
            }
            else if (hash.indexOf("$BODY") == 0) {
                self.msgBuffer.push(hash.substr(5));
                self.sendAck();
            }
            else if (hash.indexOf("$OK") == 0 && hash.split('-')[1] == self.msgSeq) {
                self.msgSeq = null;
                var msg = self.msgBuffer.join("");
                if (self.onMessage) self.onMessage(msg);
                self.msgBuffer = [];
            }
            else if (hash == "$ACK") {
                self.acked = true;
            }
            else if (hash == "$READY") {
                self.ready = true;
                if (self.onIFrameReady) self.onIFrameReady();
            }
            location.hash = "";
        }

        if (window.addEventListener)
            window.addEventListener("hashchange", onHashChange);
        else {
            var lastHash = location.hash;
            var hnd = setInterval(() => {
                if (location.hash != lastHash) {
                    onHashChange(null);
                    lastHash = location.hash;
                }
            }, 50);
        }

    }

}
