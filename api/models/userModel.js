'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var Friends = require('./friendsModel');

var UserSchema = new Schema({
    name: {
        type: String,
        Required: 'Please enter a valid name'
    },
    email: {
        type: String,
        Required: 'Please enter an email'
    },
    access_key: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    picture: String,
    facebook: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
    linkedIn: {
        type: Boolean,
        default: false
    },
    twitter: {
        type: Boolean,
        default: false
    },
    github: {
        type: Boolean,
        default: false
    },
    social_id: String,
    active: {
        type: Boolean,
        default: false
    }
});

UserSchema.statics.isFriend = function(user, friend) {
    return new Promise(function(resolve, reject) {
        Friends.findOne({
            user: user,
            friend: friend,
            accepted: true
        }).then(function (res) {
            if (res == null) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch(function(err){
            console.log(err);
        });
        }
    );
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Users', UserSchema);
