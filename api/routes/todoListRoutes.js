'use strict';

module.exports = function(app) {
  var todoList = require('../controllers/todoListController');
  var userController = require('../controllers/userController');
  // var fs = require('fs');


  app.route('/')
    .get(userController.home);
  // todoList Routes
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  //test for socket

  // app.ws('/test', function(ws, req) {
  //   ws.on('message', function(msg) {
  //     app.get(todoList.test_socket);
  //     console.log(msg);
  //   });

  //   console.log(ws.sockets.connected);
  // });


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);

  app.route('/users/facebook_login')
    .post(userController.find_or_create_an_user_facebook);

  app.route('/users/google_login')
    .post(userController.find_or_create_an_user_google);

  app.route('/users/user_info')
    .get(userController.user_info);

  app.route('/users')
    .get(userController.get_all_users);

  app.route('/token')
    .get(userController.get_all_token);


  app.route('/users/:user')
    .delete(userController.delete_user);

  app.route('/users/get/:user')
    .get(userController.get_user);

  app.route('/token/:id')
    .delete(userController.delete_token);


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
};
