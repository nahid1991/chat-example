'use strict';


module.exports = function(io){
    // this function expects a socket_io connection as argument
    // now we can do whatever we want:
    io.on('connection', function(socket){
        console.log('a user is connected', socket.id);
        socket.on('something else',function(msg){

            // as is proper, protocol logic like
            // this belongs in a controller:
            io.emit('something else', msg);
        });

        socket.on('disconnect', function(){
            console.log('a user disconnected', socket.id);
        });
    })
};