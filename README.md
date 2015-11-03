# server-push-demo
Server push demo of long polling, iframe-streaming and web socket.

## 介绍

### polling (ajax轮询)
客户端定时向服务器发送ajax请求，服务器需要推送，则返回响应的消息。<br>
缺点：需要服务器有很快的响应速度，会导致消息的延迟推送，并且会浪费大量的网络流量。

### long polling (长轮询)
客户端向服务器发送ajax请求后，服务器阻塞不立即响应，待有消息需要推送或超时才返回消息，客户端收到消息后，再进行下一轮的请求，等待消息推送。<br>
缺点：需要服务器有很强的并发能力，能够同时hold住大量的请求，同样也会浪费网络流量。

### iframe streaming (服务器推送)
创建一个隐藏的iframe，将其src属性指向服务器推送消息的地址，服务器阻塞请求，直到需要返回时，返回`<script>window.parent.callback(data)</script>`的文本，待iframe加载完成后，就会调用相应的回调函数，完成服务器消息推送，之后将src属性重新赋值，就会继续请求下一轮的消息推送。ie8及其以下版本，阻塞iframe请求，会导致页面一直呈现加载的状态，可以通过ActiveXObject的htmlfile来解决。<br>
缺点：chrome等浏览器依然会出现页面一直呈现加载状态的情况

### Web Socket
是HTML5中的一种新的持久化协议，实现了浏览器与服务器全双工通信，更快的响应速度，不会浪费网络流量。<br>
缺点：[目前浏览器支持不好](http://caniuse.com/#search=WebSocket)

## 查看demo
demo主要实现了修改服务器端文本后，服务器端可以推送修改后的文本内容到浏览器端呈现。

```
git clone github.com:vicerwang/server-push-demo.git
cd server-push-demo
npm install
npm test
open http://localhost:3000/long-polling.html
open http://localhost:3000/iframe-streaming.html
open http://localhost:3000/websocket.html
```
修改server-push-demo根目录下的test.txt内容后，页面会自动显示test.txt修改后的内容。
