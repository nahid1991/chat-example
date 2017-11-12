'use strict';

module.exports = function (app) {
    let userController = require('../controllers/userController');
    let friendsController = require('../controllers/friendsController');

    app.route('/users/facebook_login')
        .post(userController.findOrCreateAnUserFacebook);

    app.route('/users/google_login')
        .post(userController.findOrCreateAnUserGoogle);

    app.route('/users/user_info')
        .get(userController.userInfo);

    app.route('/users/friends')
        .get(friendsController.getFriends);
	
	app.route('/people/:letters')
	    .get(friendsController.getPeople);

    app.route('/users/make_friends/:friendId')
        .get(friendsController.postFriends);

    app.route('/users/remove_friends/:friendId')
        .get(friendsController.removeFriends);

    app.route('/token')
        .get(userController.getAllToken);

    app.route('/users/:user')
        .get(userController.getUserInfo);

    app.route('/users/get/:user')
        .get(userController.getUser);

    app.route('/token/:id')
        .delete(userController.deleteToken);
};
