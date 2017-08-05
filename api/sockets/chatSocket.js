'use strict';

module.exports.respond = function(socket_io){
    // this function expects a socket_io connection as argument
    socket_io.on('connection', function(socket){
       console.log('A user is connected on: ', socket.id);
    });

    // now we can do whatever we want:
    socket_io.on('something else',function(msg){

        // as is proper, protocol logic like
        // this belongs in a controller:
        socket_io.emit('something else', msg.message);
        console.log(socket_io.id + ' sent: ' + JSON.stringify(msg));
    });
};