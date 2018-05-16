class Global{

    constructor(  ){
        this.globalRoom = [];
    }

    enterRoom(id,name,room,image){

        var user = {id , name , room,image};
        this.globalRoom.push(user);
        return user;
    }

    getUser(id){
        return this.globalRoom.filter((user) => user.id === id)[0];
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.globalRoom = this.globalRoom.filter((user) => user.id != id); 
        }
       
        return user;

    }
     getRoomList(room){
        var roomList = this.globalRoom.filter((user)=> user.room === room);
        var userNamesList = roomList.map(function(user){

            return {
                name: user.name,
                image: user.image
            }
        }
        );

        return userNamesList
    }

}

module.exports = {Global}