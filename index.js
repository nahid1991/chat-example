var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4200;
var mongoose = require('mongoose');
var Task = require('../chat-example/api/models/todoListModel');
var Users = require('../chat-example/api/models/userModel');
var Friends = require('../chat-example/api/models/friendsModel');
var Chat = require('../chat-example/api/models/chatModel');
var Token = require('../chat-example/api/models/tokenModel');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/Chatdb');

var promise = mongoose.connect('mongodb://localhost/Chatdb', {
    useMongoClient: true,
    /* other options */
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
    socket.broadcast.to(socket.id).emit('chat message', 'for your eyes only');
  });
});

module.exports.io = io;

http.listen(port, function(){
  console.log('listening on *:' + port);
});
