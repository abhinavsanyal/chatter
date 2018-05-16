$(document).ready(function(){
    var socket = io();
    
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    // $('#reload').load(location.href + ' #reload');
    
    socket.on('connect', function(){

      
        var params = {
            sender: sender
        }
        
        socket.emit('joinRequest', params, function(){
            console.log('Joined');
        });
        // $('#reload').load(location.href + ' #reload');
    });


    socket.on('newFriendRequest', function(friend){
       console.log('new request',friend);
       $('#reload').load(location.href + ' #reload');
       $(document).on('click','#accept_friend', function(){

            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
        
        
            $.ajax({
                url: '/group/'+room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
             });
             $('#reload').load(location.href + ' #reload');
        });


        $(document).on('click','#cancel_friend', function(){

            var user_Id = $('#user_Id').val();
           
            
            $.ajax({
                url: '/group/'+room,
                type: 'POST',
                data: {
                    user_Id: user_Id,
                  
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        });

    
    });

  
    $('#add_friend').on('submit', function(e){
        e.preventDefault();
        var receiverName = $('#receiverName').val();

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                receiver : receiverName
            },
            success: function(){
                socket.emit('friendRequest',{receiver:receiverName , sender: sender},function(){
                    console.log('request sent');
                })
            }

        })

    })


    $('#accept_friend').on('click', function(){

        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });

    
    $('#cancel_friend').on('click', function(){

        var user_Id = $('#user_Id').val();
       
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                user_Id: user_Id,
              
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });
})


