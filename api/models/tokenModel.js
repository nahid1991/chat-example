'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = mongoose.model('Users');

var TokenSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  token: String
});

module.exports = mongoose.model('Token', TokenSchema);
