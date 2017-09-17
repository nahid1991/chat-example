'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');
let Friends = require('./friendsModel');

let UserSchema = new Schema({
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
            friend: friend
        }).then(function (res) {
            if (res == null) {
                resolve({
                    friend: false,
                    accepted: false,
                    chat_room: null
                });
            } else {
                if(res.accepted == false) {
                    resolve({
                        friend: true,
                        accepted: false,
                        chat_room: res.chat_room
                    });
                } else {
                    resolve({
                        friend: true,
                        accepted: true,
                        chat_room: res.chat_room
                    });
                }
            }
        }).catch(function(err){
            reject(err);
        });
        }
    );
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Users', UserSchema);
