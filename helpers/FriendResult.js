module.exports = function(async,Users,Message){
    return {
        postRequest: function(req,res,url){



            
            //add friend post request
            async.parallel(
                [
                    //add friend ajax call from sendRequest.js update receiver 
                    function(callback){

                        
                        if(req.body.receiver){
                            Users.update({
                                'username':req.body.receiver,
                                'requestReceived.userId': {$ne: req.user._id },
                                'friendList.friendId': {$ne: req.user._id }
    
    
                            },
                            {
                                $push : {
                                    requestReceived : {
                                        userId: req.user._id,
                                        username: req.user.username
                                    }
                                },
                                $inc : { totalRequest :1 }
                            }
                            , (err,count)=>{
                                console.log('receiver',count);
                                callback(err,count);
                            })

                        }
                  
                    },

                    //add friend ajax call from sendRequest.js update sender 
                    function(callback){

                        if(req.body.receiver){
                             Users.update({
                            'username':req.user.username,
                            'requestSent.username': {$ne: req.body.receiver },
                            
                            },
                            {
                               $push : {
                                requestSent : {
                                    username: req.body.receiver
                                }
                            },
                            
                            }
                            , (err,count)=>{
                                console.log('sender',count);
                                 callback(err,count);
                            })
                        }
                    }
                 
                ],
                function(err,results){
                   
                   
                    res.redirect(url);
                 
                }
            )
           

            //accept and cancel post requests
            async.parallel([

                 // update receiver User document to empty requestReceived and reset total count
                function(callback){
                    if(req.body.senderId){
                      
                        Users.update({
                            '_id': req.user._id,
                            'friendList.friendId': {$ne: req.body.senderId}
                        }, {
                            $push: {friendList: {
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                            $pull: {requestReceived: {
                                userId: req.body.senderId,
                                username: req.body.senderName
                            }},
                            $inc: {totalRequest: -1}
                        }, (err, count) => {
                          
                            callback(err, count);
                        });
                    }
                },
            // update sender User document to empty requestSent and reset total count
                function(callback){
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.body.senderId,
                            'friendList.friendId': {$ne:  req.user._id}
                        }, {
                            $push: {friendList: {
                                friendId: req.user._id,
                                friendName: req.user.username
                            }},
                            $pull: {requestSent: {
                             
                                username:  req.user.username
                            }},
                           
                        }, (err, count) => {
                            
                            callback(err, count);
                        });
                    }
                },
        // cancel sender side
                function(callback){
                    if(req.body.user_Id){
                        console.log('cancel');
                        Users.update({
                            '_id': req.user._id,
                            'requestReceived.userId': {$eq:  req.body.user_Id}
                        }, {
                           
                            $pull: {requestReceived: {
                             
                                userId:  req.body.user_Id
                            }},
                           $inc : {totalRequest : -1}
                        }, (err, count) => {
                            
                            callback(err, count);
                        });
                    }
                },
        // cancel receiver side
                function(callback){
                    if(req.body.user_Id){
                        console.log('cancel');
                        Users.update({
                            '_id':  req.body.user_Id,
                            'requestSent.username': {$eq:  req.user.username}
                        }, {
                           
                            $pull: {requestSent: {
                             
                                username:   req.user.username
                            }},
                          
                        }, (err, count) => {
                            
                            callback(err, count);
                        });
                    }
                },

                
                function(callback){
                    if(req.body.chatId){
                        Message.update({
                            '_id': req.body.chatId
                        },{
                            'isRead': true
                        },(err,done)=>{
                            console.log(done);
                            callback(err,done)
                        })
                    }
                }
            
            
                 ],function(err,results){
                    const res1 = results[0];
                    console.log(res1);
                    res.redirect(url);
                  
                 
                }
            )
        }
    }
}