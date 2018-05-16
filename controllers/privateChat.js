module.exports = function(async, Users,Message,FriendResult){
    return {
        setRouting: function(router){
            router.get('/chat/:name', this.getchatPage);
            router.post('/chat/:name', this.postChatPage);
           
        },
        
        getchatPage: function(req, res){
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .populate('requestReceived.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },

                function(callback){
                    const   nameRegex = new RegExp("^"+req.user.username.toLowerCase(),"i");
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{"_id":{
                            "last_message_between":{
                                $cond:[
                                    {
                                        $gt:[
                                        {$substr:["$senderName",0,1]},
                                        {$substr:["$receiverName",0,1]}]
                                    },
                                    {$concat:["$senderName"," and ","$receiverName"]},
                                    {$concat:["$receiverName"," and ","$senderName"]}
                                ]
                            }
                            }, "body": {$first:"$$ROOT"}
                            }
                        }],(err, result) => {
                            const arr = [
                                {path: 'body.sender', model: 'Users'},
                                {path: 'body.receiver', model: 'Users'}
                            ];
                            
                            Message.populate(result, arr, (err, newResult1) => {
                             
                                callback(err, newResult1);
                            });
                    })
                },

              

                function(callback){
                    Message.find({'$or':[{'senderName':req.user.username}, {'receiverName':req.user.username}]})
                        .populate('sender')
                        .populate('receiver')
                        .exec(function(err, result3){
                           
                            callback(err, result3)
                        })
                }
                
              
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                const result3 = results[2];
                // console.log(result3);
                const name = (req.params.name.split('.')[0]).replace("-"," ");
           
                const   nameRegex = new RegExp("^"+name.toLowerCase(),'i');
               
                res.render('private/privatechat',{title: 'Footballkik - Private Chat',
                 user:req.user, data: result1,chat: result2,chats: result3 , name: nameRegex});
            });
        },

        postChatPage: function(req, res){

            const name = (req.params.name.split('.')[0]).replace("-"," ");
           
            const   nameRegex = new RegExp("^"+name.toLowerCase(),'i');
            

            async.waterfall([

                function(callback){
                    if(req.body.message){
                        Users.findOne({'username': {$regex: nameRegex}},(err,user)=>{
                           
                            callback(err,user);
                        })
                    }
                },

                function(user,callback){

                   
                    if(req.body.message){
                        const newMessage = new Message();
                        newMessage.sender = req.user._id;
                        newMessage.receiver = user._id;
                        newMessage.senderName = req.user.username ;
                        newMessage.receiverName = user.username;
                        newMessage.userImage = req.user.userImage;
                        newMessage.message = req.body.message;
                        newMessage.createdAt = Date.now();

                        newMessage.save((err,result)=>{
                            if(err){
                                console.log('gone case');
                                return next(err);
                            }
                            
                            callback(err,result);
                        })

                    }
                }

            ],(err, results) => {
              res.redirect('/chat/'+ req.params.name);
            })

            FriendResult.postRequest(req,res,'/chat/'+ req.params.name);
          
        },
        
   
    }
}






























