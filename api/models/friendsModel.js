'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Users = require('./userModel');
let mongoosePaginate = require('mongoose-paginate');

let FriendSchema = new Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	friend: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	initiator: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	chat_room: String,
	last_talked: Date,
	accepted: Boolean
});

FriendSchema.methods.findFriendInfo = function (id) {
	return Users.findOne({'_id': id}).toArray();
};

FriendSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Friends', FriendSchema);
