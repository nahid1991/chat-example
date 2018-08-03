'use strict';

let mongoose = require('mongoose'),
	Users = mongoose.model('Users'),
    Token = mongoose.model('Token');
    
exports.SaveMessage = function (messageObject) {
    console.log(messageObject);
};