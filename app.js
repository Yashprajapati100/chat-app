require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const userroute = require('./src/v1/routes/user');
const {user,chat} = require('./src/data/models/index')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const session=require('express-session');
const { Op } = require('sequelize');


app.use(session({secret:'demo'}))
// const db  = require('./config/db');
// db.connection();
app.set('view engine','ejs')
app.set('views','./src/v1/resources')
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100000mb'
}))
app.use(bodyParser.json({
    limit: '100000mb'
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname,'public'))); 
// app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));
app.use('/user', express.static(path.join(__dirname, '/public/user')));


app.use(userroute);

io.on('connection', async(socket) => {
    console.log('a user connected');
    console.log(socket.handshake.auth.token)
    await user.update({is_online:1},{
        where:{
            id:socket.handshake.auth.token
        }
    })

    // user broadcast online status
    socket.broadcast.emit('useronline',{user_id:socket.handshake.auth.token})
    socket.on('disconnect', async() => {
        console.log('a user disconnected');
        await user.update({is_online:0},{
            where:{
                id:socket.handshake.auth.token
            }
        })

        // user broadcast offline status
        socket.broadcast.emit('useroffline',{user_id:socket.handshake.auth.token})
    })

    // load new chat
    socket.on('newchat',(data)=>{
        socket.broadcast.emit('loadnewchat',data)
    })

    socket.on('existsChat',async(data)=>{
        const chats=await chat.findAll({
            where:{
                [Op.or]:[
                    {
                    sender_id:data.sender_id,
                    receiver_id:data.receiver_id
                    },
                    {
                        sender_id:data.receiver_id,
                        receiver_id:data.sender_id
                    },
                ]
            },
            include: ['sender','receiver'],
            order:['created_at']
        })
        // var chats =await chat.findAll(
        //     {
        //       where:{[Op.or]:{{sender_id:data.sender_id,receiver_id:data.receiver_id},{sender_id:data.receiver_id,receiver_id:data.sender_id}}}
        //     })
        socket.emit('loadchats',{chats:chats})
    })

    socket.on('receiverdata',async(data)=>{
        const receiverdetails=await user.findOne({
            where:{
                id:data.receiver_id
            }
        })
        socket.emit('receiverprofile',receiverdetails)
    })

});

server.listen(3000, () => {
    console.log('app listen on port 3000')
});
