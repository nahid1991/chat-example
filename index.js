var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4200;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    socket.broadcast.to(socket.id).emit('chat message', 'for your eyes only');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
