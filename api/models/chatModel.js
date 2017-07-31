'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./userModel');

var ChatSchema = new Schema({
  receiver: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  sender: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  text: {
    type: String,
    Require: 'Need to say something'
  },
  file: String
});

module.exports = mongoose.model('Chat', ChatSchema);
