module.exports = function(async,Users,Message){

    return {
        setRouting: function(router){
            router.get('/latestnews',this.getNews)
        },

        getNews: function(req,res){

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
                    }



            ],(err,results)=>{
                var res1 = results[0];
                var res2 = results[1];
                res.render('news/news',{title:'news',user: req.user,data: res1, chat:res2})
            })

         
        }
    }
}