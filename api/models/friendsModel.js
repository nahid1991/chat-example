'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');

var FriendSchema = new Schema({
  receiver: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  sender: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  accepted: Boolean
});

module.exports = mongoose.model('Friends', FriendSchema);
