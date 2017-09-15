'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Users = mongoose.model('Users');

let TokenSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  token: String
});

module.exports = mongoose.model('Token', TokenSchema);
