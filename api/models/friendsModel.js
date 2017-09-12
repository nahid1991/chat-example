'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');
var mongoosePaginate = require('mongoose-paginate');

var FriendSchema = new Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	friend: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	chat_room: String,
	last_talked: Date,
	accepted: Boolean
});

FriendSchema.methods.findFriendInfo = function (id) {
	return Users.findOne({'_id': id}).toArray();
};

FriendSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Friends', FriendSchema);
