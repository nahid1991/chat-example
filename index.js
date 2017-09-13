var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4201;
var mongoose = require('mongoose');
var Users = require('../chat-example/api/models/userModel');
var Friends = require('../chat-example/api/models/friendsModel');
var Chat = require('../chat-example/api/models/chatModel');
var Token = require('../chat-example/api/models/tokenModel');
var bodyParser = require('body-parser');
require('../chat-example/api/sockets/chatSocket')(io);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Chatdb', {
	useMongoClient: true,
	/* other options */
});

// io.sockets.on('connection', socketFile.respond);
// socketFile(io);

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

var routes = require('./api/routes/routes');
routes(app);


http.listen(port, function(){
  console.log('listening on *:' + port);
});
