var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8080;
var users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
  console.log('new connection made');

  // When new socket joins
  socket.on('join', function(data) {
    socket.nickname = data.nickname;
    users[socket.nickname] = socket; 
    var userObj = {
      nickname: data.nickname,
      socketid: socket.id
    }
    users.push(userObj);
    io.emit('all-users', users);
  });

  socket.on('send-message', function(data) {
    socket.broadcast.emit('message-received', data);
  });

  socket.on('send-like', function(data) {
    console.log(data);
    console.log(data.like);
    console.log(data.from);
    // socket.broadcast.emit('user-liked', data);
    socket.broadcast.to(data.like).emit('user-liked', data);
  });

  socket.on('disconnect', function() {
    users = users.filter(function(item) {
      return item.nickname !== socket.nickname;
    });
    io.emit('all-users', users);
  });

});

server.listen(port, function() {
  console.log("Listening on port " + port);
});