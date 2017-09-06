'use strict';

var mongoose = require('mongoose'),
	Users = mongoose.model('Users'),
	Friends = mongoose.model('Friends'),
	Token = mongoose.model('Token');

exports.getAllUsers = function (req, res) {
	var extract = req.header('Authorization').split(" ");
	var token = extract[1];
	
	Token.findOne({'token': token}, function (err, token) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			if (token == 'null') {
				console.log(err);
				throw err;
			} else {
				Users.paginate({'_id': {$ne: token.user}}, {page: req.query.page, limit:10}, function (err, users) {
					if (err) {
						res.send(err);
					}
					else {
						res.json(users);
					}
				});
			}
		}
	});
};

exports.getPeople = function(req,res) {
	Users.paginate({name: {$regex: '.*' + req.params.letters + '.*', $options: "i"}}, {page: req.query.page, limit:10}, function(err, users){
		if(err) {
			res.json(err);
		} else {
			console.log(req.params.letters);
			res.json(users);
		}
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


