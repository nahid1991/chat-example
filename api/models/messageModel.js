'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');

var MessageSchema = new Schema({
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	read: Boolean,
	message: String
});

module.exports = mongoose.model('Messages', MessageSchema);