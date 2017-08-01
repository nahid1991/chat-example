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
var bodyParser = require('body-parser');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/Chatdb');

var promise = mongoose.connect('mongodb://localhost/Chatdb', {
    useMongoClient: true,
    /* other options */
});


io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.on('something else', function(msg){
    io.emit('something else', msg);
    console.log(msg);
    socket.broadcast.to(socket.id).emit('something else', 'for your eyes only');
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var routes = require('../chat-example/api/routes/todoListRoutes');
routes(app);


http.listen(port, function(){
  console.log('listening on *:' + port);
});
