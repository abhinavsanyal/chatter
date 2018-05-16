$(document).ready(function(){
    var socket =io();


    var userPic = $('#name-image').val();
    
    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.'); 
    $('#receiver_name').text(newParam[0]);
    swap(newParam,0,1);
    var paramTwo = newParam[0]+'.'+newParam[1];

    socket.once('connect',function(){
        var params ={
            room1 : paramOne,
            room2 : paramTwo
        }

        socket.emit('join PM',params,function(){
            console.log('private chat joined');
        })

        socket.on('message display',function(){
            console.log('refresh');
            $('#reload').load(location.href + ' #reload');
        })

        socket.on('new refresh', function(){
            $('#reload').load(location.href + ' #reload');
        });
       
    })

  

    socket.on('new message',function(message){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: message.text,
            sender: message.sender,
            userImage: message.image
            
        });
        
        $('#messages').append(message);
    })

    $('#message_form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        var sender = $('#name-user').val();

        if(msg.trim().length > 0){




                socket.emit('private message', {
                    text: msg,
                    sender: sender,
                    room: paramOne,
                    userPic: userPic
                
                }, function(){
                    $('#msg').val('');
                });
        }
        
     
        
    });

    $('#send-message').on('click', function(){
        var message = $('#msg').val();
        
        $.ajax({
            url:'/chat/'+paramOne,
            type: 'POST',
            data: {
                message: message
            },
            success: function(){
                $('#msg').val('');
            }
        })
    });
})

function swap(input,value_1,value_2){
    var temp = input[value_1];
    input[value_1]=input[value_2];
    input[value_2]=temp;
}