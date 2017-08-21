'use strict';

module.exports = function (app) {
    var userController = require('../controllers/userController');

    app.route('/users/facebook_login')
        .post(userController.findOrCreateAnUserFacebook);

    app.route('/users/google_login')
        .post(userController.findOrCreateAnUserGoogle);

    app.route('/users/user_info')
        .get(userController.userInfo);

    app.route('/users')
        .get(userController.getAllUsers);

    app.route('/users/friends/:user')
        .get(userController.getFriends);

    app.route('/users/friends_make/:userOne/:userTwo')
        .get(userController.postFriends);

    app.route('/token')
        .get(userController.getAllToken);


    app.route('/users/:user')
        .get(userController.getUserInfo);

    app.route('/users/get/:user')
        .get(userController.getUser);

    app.route('/token/:id')
        .delete(userController.deleteToken);
};
