'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');

var FriendSchema = new Schema({
    user_side: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    friend_side: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    accepted: Boolean
});

FriendSchema.methods.findFriendInfo = function(id){
    return Users.findOne({'_id': id}).toArray();
};

module.exports = mongoose.model('Friends', FriendSchema);
