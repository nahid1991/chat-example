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
	retrieveSenderUser(req.params.user, function (err, friends) {
		if (err) {
			res.json(err);
		} else {
			res.json(friends);
		}
	});
};

function retrieveSenderUser(id, callback) {
	Friends.find({user_side: id}, {'friend_side': 1, '_id': 0})
	.lean()
	.populate('friend_side')
	.exec(function (err, data) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, data);
		}
	});
};

exports.postFriends = function (req, res) {
	var newFriends = new Friends(
		{
			user_side: req.params.userOne,
			friend_side: req.params.userTwo,
			accepted: true
		}
	);
	
	newFriends.save();
	
	var newFriendsTwo = new Friends(
		{
			user_side: req.params.userTwo,
			friend_side: req.params.userOne,
			accepted: true
		}
	);
	
	newFriendsTwo.save();
	
	res.json(newFriends);
};


