var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

let onlineUsers = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

io.on('connect', (socket) => {

    socket.on('online', (data) => {
        socket.user_id = data.id;
        socket.join(data.id);
        onlineUsers.push(data.id)
        io.sockets.emit("liveusers", onlineUsers);
    });

    //simula o walker enviando a coordenada dele para um usuario
    socket.on('coords', (data) => {
        let _user = {
            who: data.myid,
            latitude: data.latitude,
            longitude: data.longitude
        }

        socket.in(data.id).emit('user-coords', _user);
    });

    socket.on('disconnect', function () {
        onlineUsers.splice(onlineUsers.indexOf(socket.user_id), 1);
        io.sockets.emit("liveusers", onlineUsers);
    });
});

http.listen(port, function () {
    console.log(`Listening on port ${port}`);
});