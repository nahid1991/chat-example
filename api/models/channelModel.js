'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
    receiver: String
});

module.exports = mongoose.model('Channel', ChannelSchema);