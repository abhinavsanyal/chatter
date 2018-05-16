$(document).ready(function(){
    var socket = io();
    
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    var userPic = $('#name-image').val();
    
  
    
    socket.on('connect', function(){

        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params, function(){
            //console.log('User has joined this channel');
        });
    });
  
    
    socket.on('userList', function(data){
        
        var ol = $('<ol></ol>');
        
        for(var i = 0; i < data.userNames.length; i++){
          
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+data.userNames[i]+'</a></p>');
           // console.log(data.userNames[i]);
        }

            
        $(document).on('click', '#val', function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr("href", "/profile/"+$(this).text());
        });
        
        $('#numValue').text('('+data.userNames.length+')');
        $('#users').html(ol);

        
        
    });


    socket.on('newMessage',function(message){
        var template = $('#message_template').html();
        var message1 = Mustache.render(template, {
            text: message.text,
            sender: message.sender,
            userImage: message.image
            
        });
        console.log('i am called');
        $('#messages').append(message1);
    })
    

 

    
    $('#message-form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        
        console.log('form sumbit');
        
        socket.emit('createMessage', {
            text: msg,
            room: room,
            sender: sender,
            userPic: userPic
           
        }, function(){
            console.log('createMessage Event handled')
            $('#msg').val('');
        });
        
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
        
    });

  
    
});











