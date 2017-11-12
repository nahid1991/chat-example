'use strict';

module.exports = function (io){
    // this function expects a socket_io connection as argument
    // now we can do whatever we want:
    io.on('connection', function(socket){
        console.log('a user is connected', socket.id);

        socket.on('join room', function (room) {
            try{
                socket.join(room);
            } catch (err) {
                console.log(new Error(err))
            }
        });

        socket.on('message', function(msg) {
            io.emit(msg.chat_room_user, msg);
            io.emit(msg.chat_room_friend, msg);
        });

        socket.on('disconnect', function(){
            console.log('a user disconnected', socket.id);
        });
    });
};