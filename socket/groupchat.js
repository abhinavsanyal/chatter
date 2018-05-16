


module.exports = function(io,Users){
    

    const users = new Users();

    io.on('connection', (socket) => {
        
        socket.on('join', (params, callback) => {
            console.log('connected');
            socket.join(params.room);
            
            users.addUser(socket.id,params.name,params.room);
           // console.log(users.getUserList(params.room));
            io.to(params.room).emit('userList',{userNames : users.getUserList(params.room)});

            callback();
        });
        


      

        socket.on('createMessage', (message, callback) => {

            console.log('called twice');

            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                sender: message.sender,
                image: message.userPic
                
            });
            
            callback();
        });
        
        socket.on('disconnect', () => {
          
           var user = users.removeUser(socket.id);
           if(user){
            io.to(user.room).emit('userList',{userNames : users.getUserList(user.room)});
           }
            
          //  console.log("disconnected")
        })
        })
   
}













