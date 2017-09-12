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
			throw err;
		} else {
			Users.paginate({'_id': {$ne: token.user}}, {page: req.query.page, limit: 10}).then(function(users){
				var usersList = JSON.parse(JSON.stringify(users));
				for(var i=0; i<usersList.docs.length; i++){
					usersList.docs[i].friend = true;
				}
				res.json(usersList);
			}).catch(function(err){
				console.log(err);
				throw err;
			});
		}
	}).catch(function(err){
		console.log(err);
		throw err;
	});
};

exports.getPeople = function (req, res) {
	Users.paginate({name: {$regex: '.*' + req.params.letters + '.*', $options: "i"}}, {
		page: req.query.page,
		limit: 10
	}).then(function(people){
		var usersList = JSON.parse(JSON.stringify(people));
		for(var i=0; i<usersList.docs.length; i++){
			usersList.docs[i].friend = false;
		}
		res.json(usersList);
	}).catch(function(err){
		console.log(err);
		throw err;
	});
};

exports.getFriends = function (req, res) {
	var extract = req.header('Authorization').split(" ");
	var token = extract[1];
	
	Token.findOne({'token': token}).then(function(token){
		if(token == null) {
			console.log(err);
			throw err;
		} else {
			Friends.paginate({user: token.user, accepted: true}, {page: req.query.page, limit: 10, populate: 'friend', lean: true})
			.then(function(friends){
				// var usersList = JSON.parse(JSON.stringify(users));
				// for(var i=0; i<usersList.docs.length; i++){
				// 	usersList.docs[i].friend = true;
				// }
				console.log(JSON.stringify(friends));
				res.json(friends);
			}).catch(function(err){
				console.log(err);
				throw err;
			});
		}
	}).catch(function(err){
		console.log(err);
		throw err;
	});
};

exports.postFriends = function (req, res) {
	var newFriends = new Friends(
		{
			user: req.params.userOne,
			friend: req.params.userTwo,
			chat_room: req.params.userOne + '-' + req.params.userTwo,
			accepted: false
		}
	);
	
	newFriends.save();
	
	var newFriendsTwo = new Friends(
		{
			user: req.params.userTwo,
			friend: req.params.userOne,
			chat_room: req.params.userTwo + '-' + req.params.userOne,
			accepted: false
		}
	);
	
	newFriendsTwo.save();
	
	res.json(newFriends);
};


