'use strict';

let mongoose = require('mongoose'),
    Users = mongoose.model('Users'),
    Friends = mongoose.model('Friends');

module.exports = function (io) {
    // this function expects a socket_io connection as argument
    // now we can do whatever we want:
    io.on('connection', function (socket) {
        console.log('a user is connected', socket.id);

        socket.on('join room', function (room) {
            try {
                socket.join(room);
            } catch (err) {
                console.log(new Error(err))
            }
        });

        socket.on('message', function (msg) {
            io.emit(msg.chat_room_user, msg);
            io.emit(msg.chat_room_friend, msg);
        });

        socket.on('removeFriend', function (data, fn) {
            Friends.remove({
                $or: [{user: data.sender, friend: data.receiver},
                    {user: data.receiver, friend: data.sender}]
            }).then(function (response) {
                fn({success: true});
            }, function (err) {
                console.log(err);
                fn({success: false});
            });
        });

        socket.on('acceptFriend', function (data, fn) {
            Friends.update({
                user: data.sender,
                friend: data.receiver
            }, {$set: {accepted: true}}).then(function (response) {
                console.log(response);
                Friends.update({
                    user: data.receiver,
                    friend: data.sender
                }, {$set: {accepted: true}}).then(function (res) {
                    console.log(res);
                    fn({success: true});
					io.emit(data.receiver+'-receivedRequest', data.user_info);
                }, function (err) {
                    console.log(err);
                    fn({success: false});
                });

            }, function (err) {
                console.log(err);
                fn({success: false});
            });
        });

        socket.on('addFriend', function (data, fn) {
            let newFriends = new Friends(
                {
                    user: data.sender,
                    friend: data.receiver,
                    initiator: data.sender,
                    chat_room: data.sender + '-' + data.receiver,
                    accepted: false,
                    last_talked: Date.now()
                }
            );

            newFriends.save();

            let newFriendsTwo = new Friends(
                {
                    user: data.receiver,
                    friend: data.sender,
                    initiator: data.sender,
                    chat_room: data.receiver + '-' + data.sender,
                    accepted: false,
                    last_talked: Date.now()
                }
            );

            newFriendsTwo.save();

            fn({success: true});

            Users.findOne({_id: data.sender}).then(function(user){
                io.emit(data.receiver+'-receivedRequest', user);
            });
        });

        socket.on('disconnect', function () {
            console.log('a user disconnected', socket.id);
        });
    });
};