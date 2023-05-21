const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors= require('cors')
let {connectToDb , getDb} = require('./db')
const router = require('./routes.js')
const app = express();
app.use(cors());
app.use(express.json())
app.use('/',router)

const server = http.createServer(app);

const PORT =  8000;

// checking connection to database
connectToDb((err)=>{
    if(!err){
        server.listen(PORT,()=>{
            console.log("Listening to port 8000...")
        })
        app.locals.db = getDb();
    }else{
        console.log(err)
    }
})

// socket io connection
const io = socketIO(server,{cors : {origin:"*"}});


io.on('connection',socket=>{
    console.log(socket.id);

    socket.on('sendMessage',(msg,roomId,name)=>{
        if(roomId!= undefined && roomId.trim()!==''){
            socket.to(roomId).emit('receiveMessage',msg,roomId,name)
        }
        else{
            socket.broadcast.emit('receiveMessage',msg,name)
        }
    })

    socket.on('joinRoom',(name,room,cb)=>{
        if(room.trim()!==''){
            socket.join(room);
            cb(); 
        }

        socket.to(room).emit('receiveMessage','I Joined this room',room,name);
    })

    socket.on('prevRoomJoin',(roomId)=>{
        socket.join(roomId);
    })
})
