'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Users = require('./userModel');

let MessageSchema = new Schema({
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	read: Boolean,
	message: String
});

module.exports = mongoose.model('Messages', MessageSchema);