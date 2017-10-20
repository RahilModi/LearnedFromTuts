const express = require('express');
const app = express();
const socket = require('socket.io');

const server = app.listen(3000, ()=>{
    console.log("Server is running on the port 3000");
});

app.use(express.static('public'));

const io = socket(server);
io.on('connection',(socket)=>{
    console.log(`client connected with socket ${socket.id}`);
    socket.on('mouseMovement',(data)=>{
        socket.broadcast.emit('mouse',data); //to send other clients not the client by which event has been triggered
        //io.sockets.emit('mouse',data); //to send all connected clients including client by which event has been triggered
    })
})
