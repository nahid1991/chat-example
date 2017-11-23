'use strict';

let mongoose = require('mongoose'),
    Users = mongoose.model('Users'),
    Friends = mongoose.model('Friends'),
    Token = mongoose.model('Token');

exports.getPeople = function (req, res) {
    let extract = req.header('Authorization').split(" ");
    let token = extract[1];

    Token.findOne({'token': token}).then(async function (token) {
        if (token == null) {
            console.log(err);
            res.json({
                'error': 'Token mismatch'
            });
        } else {
            getPeopleHelper(req.params.letters, req.query.page, token.user, res);
        }
    }).catch(function (err) {
        console.log(err);
        throw 500;
    });
};


function getPeopleHelper(letters, page, user, res) {
    Users.paginate({$and: [{name: {$regex: '.*' + letters + '.*', $options: "i"}}, {_id: {$ne: user}}]}, {
        page: page,
        limit: 10
    }).then(async function (people) {
        let usersList = JSON.parse(JSON.stringify(people));
        for (let i = 0; i < usersList.docs.length; i++) {
            let verify = await Users.isFriend(user, usersList.docs[i]._id);
            usersList.docs[i].chat_room = verify.chat_room;
            usersList.docs[i].accepted = verify.accepted;
            usersList.docs[i].friend = verify.friend;
            usersList.docs[i].initiator = verify.initiator;
        }
        res.json(usersList);
    }).catch(function (err) {
        console.log(err);
        throw 500;
    });
}


exports.getFriends = function (req, res) {
    let extract = req.header('Authorization').split(" ");
    let token = extract[1];

    Token.findOne({'token': token}).then(function (token) {
        if (token === null) {
            res.json({
                'error': 'Token mismatch'
            });
        } else {
            Friends.paginate({
                    $or: [{user: token.user, accepted: true}, {
                        user: token.user,
                        accepted: false,
                        initiator: {$ne: token.user}
                    }]
                },
                {page: req.query.page, limit: 10, populate: 'friend', lean: true, sort: {last_talked: -1}})
                .then(function (friends) {
                    let friendsData = {
                        docs: [],
                    };

                    for (let i = 0; i < friends.docs.length; i++) {
                        friendsData.docs.push(friends.docs[i].friend);
                    }

                    for (let i = 0; i < friendsData.docs.length; i++) {
                        friendsData.docs[i].friend = true;
                        friendsData.docs[i].accepted = friends.docs[i].accepted;
                        friendsData.docs[i].chat_room = friends.docs[i].chat_room;
                    }

                    friendsData.total = friends.total;
                    friendsData.limit = friends.limit;
                    friendsData.page = friends.page;
                    friendsData.pages = friends.pages;
                    res.json(friendsData);
                }).catch(function (err) {
                console.log(err);
                throw 500;
            });
        }
    }).catch(function (err) {
        console.log(err);
        throw 500;
    });
};


exports.removeFriends = function (req, res) {
    let extract = req.header('Authorization').split(" ");
    let token = extract[1];

    Token.findOne({'token': token}).then(function (token) {
        if (token === null) {
            res.json({
                'error': 'Token mismatch'
            });
        } else {
            Friends.remove({
                $or: [{user: token.user, friend: req.params.friendId},
                    {user: req.params.friendId, friend: token.user}]
            }).then(function (response) {
                console.log(response);
                res.json({
                    status: 'success'
                });
            }, function (err) {
                console.log(err);
                res.json({
                    status: 'failed'
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.json({
            'error': 'Token mismatch'
        });
    });
};

exports.postFriends = function (req, res) {
    let extract = req.header('Authorization').split(" ");
    let token = extract[1];
    Token.findOne({'token': token}).then(function (token) {
        if (token === null) {
            res.json({
                'error': 'Token mismatch'
            });
        } else {
            let newFriends = new Friends(
                {
                    user: token.user,
                    friend: req.params.friendId,
                    initiator: token.user,
                    chat_room: token.user + '-' + req.params.friendId,
                    accepted: false
                }
            );

            newFriends.save();

            let newFriendsTwo = new Friends(
                {
                    user: req.params.friendId,
                    friend: token.user,
                    initiator: token.user,
                    chat_room: req.params.friendId + '-' + token.user,
                    accepted: false
                }
            );

            newFriendsTwo.save();

            res.json(newFriends);
        }
    }).catch(function (err) {
        console.log(err);
        res.json({
            'error': 'Token mismatch'
        });
    });
};