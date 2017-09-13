'use strict';

var mongoose = require('mongoose'),
	Users = mongoose.model('Users'),
	Friends = mongoose.model('Friends'),
	Token = mongoose.model('Token');

exports.getAllUsers = function (req, res) {
	var extract = req.header('Authorization').split(" ");
	var token = extract[1];
	
	Token.findOne({'token': token}).then(function(token){
		if(token == null) {
			console.log(err);
			throw 500;
		} else {
			Users.paginate({'_id': {$ne: token.user}}, {page: req.query.page, limit: 10}).then(function(users){
				var usersList = JSON.parse(JSON.stringify(users));
				for(var i=0; i<usersList.docs.length; i++){
					usersList.docs[i].friend = true;
				}
				res.json(usersList);
			}).catch(function(err){
				console.log(err);
				throw 500;
			});
		}
	}).catch(function(err){
		console.log(err);
		throw 500;
	});
};

exports.getPeople = function (req, res) {
    var extract = req.header('Authorization').split(" ");
    var token = extract[1];

    Token.findOne({'token': token}).then(function(token){
        if(token == null) {
            console.log(err);
            throw 500;
        } else {
            Users.paginate({name: {$regex: '.*' + req.params.letters + '.*', $options: "i"}}, {
                page: req.query.page,
                limit: 10
            }).then(function(people){
                var usersList = JSON.parse(JSON.stringify(people));
                for(var i=0; i<usersList.docs.length; i++){
                    Users.isFriend(token.user, usersList.docs[i]._id)
					.then(function(res){
						return res;
					}).catch(function(err){
						console.log(err);
					});
                }
                console.log(usersList.docs[0].friend);
                res.json(usersList);
            }).catch(function(err){
                console.log(err);
                throw 500;
            });
        }
    }).catch(function(err){
        console.log(err);
        throw 500;
    });
};

exports.getFriends = function (req, res) {
	var extract = req.header('Authorization').split(" ");
	var token = extract[1];
	
	Token.findOne({'token': token}).then(function(token){
		if(token == null) {
			console.log(err);
			throw 500;
		} else {
			Friends.paginate({user: token.user, accepted: true}, {page: req.query.page, limit: 10, populate: 'friend', lean: true})
			.then(function(friends){
				var friendsData = {
					docs : [],
				};
                for(var i=0; i<friends.docs.length; i++){
                    friendsData.docs.push(friends.docs[i].friend);
                }

                for(var i=0; i<friendsData.docs.length; i++){
                    friendsData.docs[i].friend = true;
                    friendsData.docs[i].chat_room = friends.docs[i].chat_room;
                }

                friendsData.total = friends.total;
                friendsData.limit = friends.limit;
                friendsData.page = friends.page;
                friendsData.pages = friends.pages;
				res.json(friendsData);
			}).catch(function(err){
				console.log(err);
				throw 500;
			});
		}
	}).catch(function(err){
		console.log(err);
		throw 500;
	});
};

exports.postFriends = function (req, res) {
	var extract = req.header('Authorization').split(" ");
	var token = extract[1];
	Token.findOne({'token': token}).then(function(token){
		if(token == null) {
			res.json({
				'error': 'Token mismatch'
			})
		} else {
			var newFriends = new Friends(
				{
					user: token.user,
					friend: req.params.friendId,
					chat_room: token.user + '-' + req.params.friendId,
					accepted: false
				}
			);
			
			newFriends.save();
			
			var newFriendsTwo = new Friends(
				{
					user: req.params.friendId,
					friend: token.user,
					chat_room: req.params.friendId + '-' + token.user,
					accepted: false
				}
			);
			
			newFriendsTwo.save();
			
			res.json(newFriends);
		}
	}).catch(function(err){
		console.log(err);
		throw 500;
	});
	
};


