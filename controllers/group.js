module.exports = function(async,Users,Message,FriendResult,GroupMessage){
    return {
        setRouting: function(router){
            router.get('/group/:name', this.getGroupPage);

            router.post('/group/:name', this.postGroupPage);
          
        },
        
        getGroupPage: function(req, res){


            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .populate(' requestReceived.userId')
                        
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
                    GroupMessage.find({})
                         .populate('sender')
                         .exec((err, result) => {
                            callback(err, result)
                         });
                }
            
            
            
            ],(err,results) => {
                    const res1 = results[0];
                    const res2 = results[1];
                    const res3 = results[2];
                    console.log(res1.totalRequest);
                    const name = req.params.name;  
                    
                    res.render('groupchat/group', 
                    {title: 'Footballkik - Group', data: res1,user:req.user, groupName:name,chat:res2,groupMessage: res3});
                 
                }
            )
          
         
        },

        postGroupPage: function(req,res){

            FriendResult.postRequest(req,res,'/group/'+req.params.name);

            async.parallel([
                function(callback){
                    if(req.body.message){
                        const group = new GroupMessage();
                        group.sender = req.user._id;
                        group.body = req.body.message;
                        group.name = req.body.groupName;
                        group.createdAt = new Date();
                        
                        group.save((err, msg) => {
                            callback(err, msg);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            });

        }
        
     
    }
}




























