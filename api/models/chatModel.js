'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Users = require('./userModel');

let ChatSchema = new Schema({
  receiver: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  sender: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  text: {
    type: String,
    Require: 'Need to say something'
  },
  file: String
});

module.exports = mongoose.model('Chat', ChatSchema);
