module.exports = function(io){
     
    io.on('connection', (socket) => {

      

        socket.on('join PM', (pm,callback) => {
            console.log('joined private room');
           
            socket.join(pm.room1);
            socket.join(pm.room2);
            //callback();
        });
        
        socket.on('private message', (message, callback) => {

            console.log('private message sent');
            
            io.to(message.room).emit('new message', {
                text: message.text,
                sender: message.sender,
                image: message.userPic
            });
            
            io.emit('message display', {});
            
            callback();
        });
        
        socket.on('refresh', function(){
            io.emit('new refresh', {});
        });
        
    });
}