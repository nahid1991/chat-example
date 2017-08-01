'use strict';
// var server = require('../../../node-chat-server/server');
// var io = require('socket.io')(server);

var mongoose = require('mongoose'),
Users = mongoose.model('Users'),
Token = mongoose.model('Token');

/*
*
* Test route for socket connection
*
*
* */
exports.home = function(req, res){
    res.sendFile(__dirname + '/index.html');
};

//
//
//
//  Token generator function start
//
//
//


function tokenGenerate(user){
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 50;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }

  return new Promise(function(resolve, reject){
    Token.findOne({'token': randomstring}, function(err, token){
      if(err){
        console.log(err);
        res.send(err);
      } else {

          if(token == null){
            var new_token = new Token({
              user: user,
              token: randomstring
            });
            new_token.save(function(err, token){
              if(err){
                console.log(err);
                resolve(err);
              } else {
                // console.log(token.token);
                resolve(token.token);
              }
            });
          } else {
            tokenGenerate(user);
          }
      }
    });
  });
}

//
//
//
//  Token generator function end
//
//
//



//
//
//
// facebook login start
//
//
//

exports.find_or_create_an_user_facebook = function(req, res) {
  // console.log(req.body.email);
  Users.findOne({$or:[{'email': req.body.email}, {'social_id': req.body.user_id}]}, function(err, users) {
    if (err){
      console.log(err);
      res.send(err);
    }
    else {
      if(users == null){
        var new_user = new Users(
          {
            name: req.body.name,
            social_id: req.body.user_id,
            email: (req.body.email) ? req.body.email : req.body.user_id,
            access_key: req.body.access_key,
            facebook: true,
            picture: 'https://graph.facebook.com/'+req.body.user_id+'/picture?type=large'
          }
        );
        new_user.save(function(err, user){
          if(err){
            console.log(err);
            res.send(err);
          } else {
            tokenGenerate(user).then(function(response){
              console.log(response);
              res.json(response);
            }, function(err){
              console.log(err);
            });
            // console.log(result);
            // res.json(result);
          }
        });

      } else {
        users.social_id = req.body.user_id;
        users.access_key = req.body.access_key;
        users.picture = 'https://graph.facebook.com/'+req.body.user_id+'/picture?type=large';
        users.facebook = true;
        users.update_at = Date.now();
        users.save();

        Token.remove({user: users._id}, function(err, token){
          if(err){
            res.send(err);
          } else {
            tokenGenerate(users).then(function(response){
              // console.log(response);
              res.json(response);
            }, function(err){
              console.log(err);
            });
        }

      });
      }
    }
  });
};

//
//
//
// facebook login end
//
//
//




//
//
//
// google login start
//
//
//

exports.find_or_create_an_user_google = function(req, res) {
  // console.log(req.body.email);
  Users.findOne({'email': req.body.email}, function(err, users) {
    if (err){
      console.log(err);
      res.send(err);
    }
    else {
      if(users == null){
        var new_user = new Users(
          {
            name: req.body.name,
            social_id: req.body.user_id,
            email: req.body.email,
            access_key: req.body.access_key,
            google: true,
            picture: req.body.image_url
          }
        );
        new_user.save(function(err, user){
          if(err){
            console.log(err);
            res.send(err);
          } else {
            tokenGenerate(user).then(function(response){
              // console.log(response);
              res.json(response);
            }, function(err){
              console.log(err);
            });
          }
        });

      } else {
        users.social_id = req.body.user_id;
        users.access_key = req.body.access_key;
        users.picture = req.body.image_url;
        users.google = true;
        users.update_at = Date.now();
        users.save();
        // console.log(users);

        Token.remove({user: users._id}, function(err, token){
          if(err){
            console.log(err);
            res.send(err);
          } else {
            tokenGenerate(users).then(function(response){
              // console.log(response);
              res.json(response);
            }, function(err){
              console.log(err);
            });
        }

      });
      }
    }
  });
};

//
//
//
// google login end
//
//
//



//
//
//
// user info start
//
//
//

exports.user_info = function(req, res) {
  // console.log(req.header('Authorization'));
  var extract = req.header('Authorization').split(" ");
  var token = extract[1];

  // console.log(token);
  Token.findOne({'token': token}, function(err, token){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      if(token == 'null'){
        console.log(err);
        throw err;
      } else {
        // console.log(token.user);
        Users.findOne({'_id': token.user}, function(err, user){
          if(err){
            console.log(err);
            res.send(err);
          } else {
            res.json(user);
          }
        });
      }
    }
  });
};


//
//
//
// user info ends
//
//
//

exports.delete_user = function(req, res) {
  Users.remove({
    email: req.params.user
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};

exports.delete_token = function(req, res) {
  Token.remove({
    _id: req.params.id
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Token successfully deleted' });
  });
};

exports.get_user = function(req, res) {
  Users.findOne({
    _id: req.params.user
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};



exports.get_all_users = function(req, res) {
  var extract = req.header('Authorization').split(" ");
  var token = extract[1];
  // Users.find({}, function(err, users) {
  //   if (err)
  //     res.send(err);
  //   res.json(users);
  // });

  Token.findOne({'token': token}, function(err, token){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      if(token == 'null'){
        console.log(err);
        throw err;
      } else {
        // console.log(token.user);
        Users.find({'_id': {$ne: token.user}}, function(err, users) {
          if (err)
            res.send(err);
          res.json(users);
        });
      }
    }
  });
};

exports.get_all_token = function(req, res) {
  Token.find({}, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};


