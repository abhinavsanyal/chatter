

'use strict';

module.exports = function(_,Club,async,Users,Message,FriendResult) {

    return {

        setRouting : function(router){
          
            router.get('/home', this.homePage);

            router.post('/home', this.postHomePage);
           
            
        },

   
        homePage : (req,res) => {

            async.parallel(
                [
                    // get all the documents in the collection Club
                    function(callback){
                        Club.find({} , (err,result)=>{
                            callback(err,result);
                        })
                    },

                    // get the list of all countries from all the documents in the collection Club
                    function(callback){
                        Club.aggregate([
                            {
                                $group:  {_id: "$country"  }
                            }
                        ], (err, newResult) => {
                            if(err) return console.log(err);
                           callback(err, newResult) ;
                        });
                    },
                    
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
                ],
                (err,results) => {

                    if(err) return console.log(err);
                    const res1 = results[0];
                     const res2 = results[1];
                     const res3 = results[2];
                     const res4 = results[3];
                     

                    const dataChunk  = [];
                    const chunkSize = 3;
                    for (let i = 0; i < res1.length; i += chunkSize){
                        dataChunk.push(res1.slice(i, i+chunkSize));
                    }

                    const sortedCountryList = _.sortBy(res2,'_id');

                    res.render('home' , {chunk: dataChunk ,user: req.user, country: sortedCountryList,  data: res3,chat:res4});
                 
                }
            )

          
           
        },

        postHomePage : function(req,res){

            async.parallel([

                // to update the fans array of a Club document when favourite button is pressed
                function(callback){
                    Club.update({
                        '_id':req.body.id,
                        'fans.username': {$ne: req.user.username}
                    }, {
                        $push: {fans: {
                            username: req.user.username,
                            email: req.user.email
                        }}
                    }, (err, count) => {
                        callback(err, count);
                    });
                },




            ], (err, results) => {
                res.redirect('/home');
            });


            FriendResult.postRequest(req,res,'/home');

        }


    }
}