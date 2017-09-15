'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Users = require('./userModel');

let UserSocketSchema = new Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    socket_id: String
});

module.exports = mongoose.model('UserSockets', UserSocketSchema);