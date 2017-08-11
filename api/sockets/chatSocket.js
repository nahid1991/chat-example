'use strict';


module.exports = function(io){
    // this function expects a socket_io connection as argument
    // now we can do whatever we want:
    io.on('connection', function(socket){
        socket.on('something else',function(msg){

            // as is proper, protocol logic like
            // this belongs in a controller:
            io.emit('something else', msg);
        });

        io.on('disconnect', function(){
            console.log('a user disconnected', socket.id);
        });
    })
};