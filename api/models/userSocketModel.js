'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');

var UserSocketSchema = new Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    socket_id: String
});

module.exports = mongoose.model('UserSockets', UserSocketSchema);