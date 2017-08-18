'use strict';

module.exports = function (app) {
    var todoList = require('../controllers/todoListController');
    var userController = require('../controllers/userController');
    // var fs = require('fs');


    app.route('/')
        .get(userController.home);
    // todoList Routes
    app.route('/tasks')
        .get(todoList.list_all_tasks)
        .post(todoList.create_a_task);

    app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);

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
        .delete(userController.deleteUser);

    app.route('/users/get/:user')
        .get(userController.getUser);

    app.route('/token/:id')
        .delete(userController.deleteToken);


    app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);
};
