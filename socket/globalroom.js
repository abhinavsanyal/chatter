
module.exports = function(io,Global,_){


    const Clients = new Global();
    io.on('connection', (socket)=>{

       
           socket.on('joinGlobal',(params,callback)=>{
            
           socket.join(params.room);
           Clients.enterRoom(socket.id,params.name,params.room,params.image)
           const ClientList = _.uniqBy(Clients.getRoomList(params.room),'name');
           //console.log(ClientList);

           io.to(params.room).emit('loggedInUser',ClientList);
           callback();


        });


        socket.on('disconnect', () => {
          
            var user = Clients.removeUser(socket.id);
            if(user){
                // const arr =_.uniqBy(Clients.getRoomList(user.room),'name');
                // _.remove(arr,{'name':user.name});
                io.to(user.room).emit('loggedInUser',_.uniqBy(Clients.getRoomList(user.room),'name'));
            }
             
           //  console.log("disconnected")
         })
    })
}