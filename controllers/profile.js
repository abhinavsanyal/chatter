module.exports = function(async,Users,Message,aws,FriendResult){
    return{

        setRouting : function(router){
            router.get('/settings/profile', this.getProfilePage)
            router.get('/profile/:name', this.overviewpage)
            
            router.post('/userUpload', aws.Upload.any())
            router.post('/settings/profile', this.postProfilePage)
            router.get('/profile/:name', this.overviewPostPage)
        },

        getProfilePage : function(req,res){
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
            
            
            ],(err,results) => {
                    const res1 = results[0];
                    const res2 = results[1];
                   
                   
                    
                    
                    res.render('user/profile', 
                    {title: 'Footballkik - profile', data: res1,user:req.user,chat:res2});
                 
                }
            )
        },


        postProfilePage: function(req,res){
            FriendResult.postRequest(req,res,'/settings/profile');



            async.waterfall([
                function(callback){
                    Users.findOne({'_id':req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                },
                
                function(result, callback){
                    if(req.body.upload === null || req.body.upload === ''){
                        Users.update({
                            '_id':req.user._id
                        },
                        {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            mantra: req.body.mantra,
                            gender: req.body.gender,
                            country: req.body.country,
                            userImage: result.userImage
                        },
                        {
                            upsert: true
                        }, (err, result) => {
                            res.redirect('/settings/profile');
                        })
                    } else if(req.body.upload !== null || req.body.upload !== ''){
                        Users.update({
                            '_id':req.user._id
                        },
                        {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            mantra: req.body.mantra,
                            gender: req.body.gender,
                            country: req.body.country,
                            userImage: req.body.upload
                        },
                        {
                            upsert: true
                        }, (err, result) => {
                            res.redirect('/settings/profile');
                        })
                    }
                }
            ]);
                      
        },

        overviewpage: function(req,res){
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.params.name})
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
            
            
            ],(err,results) => {
                    const res1 = results[0];
                    const res2 = results[1];
                   
                    console.log(res1);
                    
                    
                    res.render('user/overview', 
                    {title: 'Footballkik - overview', data: res1,user:req.user,chat:res2});
                 
                }
            )
        },

        overviewPostPage: function(req,res){
           
                FriendResult.PostRequest(req, res, '/profile/'+req.params.name);
           
        }

    }
}