var http = require('http');
var fs = require('fs');
var express = require('express');
var chokidar = require('chokidar');
var ws = require('websocket.io');

var app = express();
var server = http.createServer(app).listen(3000);

var resLLArr = [];
var resISArr = [];
var socketArr = [];

app.use(express.static(__dirname + '/public'));

app.post('/longPolling', function(req, res, next) {
    resLLArr.push(res);
});

app.get('/iframeStreaming', function(req, res, next) {
    resISArr.push(res);
});

ws.attach(server).on('connection', function(socket) {
    socketArr.push(socket);
    socket.on('close', function(data) {
        var index = -1;
        socketArr.forEach(function(s, i) {
            if (s === socket) {
                index = i;
            }
        });
        socketArr.splice(index, 1);
    });
});

var watcher = chokidar.watch('./test.txt');
watcher.on('change', function(path) {
    fs.readFile(path, 'utf8', function(err, data) {
        resLLArr.forEach(function(res) {
            res.send(data);
        });
        resLLArr.length = 0;

        resISArr.forEach(function(res) {
            res.send('<script>window.parent.clientcallback("' + data.trim() + '");</script>');
        });
        resISArr.length = 0;

        socketArr.forEach(function(socket) {
            socket.send(data);
        });
    });
});
