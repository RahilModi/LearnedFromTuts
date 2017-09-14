const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(1234, () => {
    console.log("Server is listening to 1234 port");
});

//socket connection setup
const io = socket(server);
io.on('connection', (socket) => {
    //connected with client using socket
    console.log(`Server is connected with socket : ${socket.id}`);

    socket.on('chat', (msg) => {
        //console.log(msg);
        io.sockets.emit('chat', msg);
    })

    socket.on('typing', (msg) => {
        //console.log(msg);
        socket.broadcast.emit('typing', msg);
    })
});
