module.exports = function(app,io){
    console.log("Server Socket Initialized");
    //Respond to connection request
    io.on('connection',(socket)=>{
        console.log('User Connection');
        //Respond to disconnect request
        socket.on('disconnect', function(){
            console.log('User Disconnected');
        });
        //Respond to getting a new message
        socket.on('add-message',(message)=>{
            //Broadcast the message to all others that are connected to this socket
            console.log(message);
            io.emit('message',{type:'message',text:message});
        });
    });   
};