//const app = require('express') ();
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
require("dotenv").config()

individualPath = "gruppe-kann-nix-51-";

const db = require('./database/redis');

const userapi = require("./routes/usersapi");

//const postsapi = require('./routes/postsapi'); -> Not used
//app.use("/post", postsapi);

// Express serve static files
app.use('/uploads', express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const cors = require('cors')
app.use(cors());
app.options('*', cors())

app.use(bodyParser.json());
app.use("/user", userapi);


app.get('/', (req, res) => {
    res.send('It works!');
});

const posts = require('./database/posts');
const user = require('./database/users');

const socketauth = require("./routes/auth");

io.use(socketauth)

io.on('connection', async socket => {

    console.log(`User ${socket.decoded.name} connected to main socket.`);
    await user.setOnline(socket.decoded.id);
    io.emit("goesonline", socket.decoded.id)

    // Wait for post event
    socket.on('new globalpost', async postAsJson => {
        const post = JSON.parse(postAsJson);

        // Save post in redis
        var id = await posts.create(post);
        let newpost = Object.assign({"postid": id.toString(), "liked": false, "likes": "0"}, post);

        // Send Post to everyone
        io.sockets.in("global").emit('post', JSON.stringify(newpost));
        io.sockets.in(socket.decoded.id).emit('post', JSON.stringify(newpost));
    });

    socket.on('leave', function(room){
        if(room === "followers"){
            user.leaveFriendsRoom(socket.decoded.id, socket);
        }else {
            socket.leave(room)
            console.log(socket.decoded.name + " left room: " + room)
        }      
    })

    socket.on('like', function(postid){
        posts.likePost(postid, socket.decoded.id);
        io.emit("newlike", postid.toString())
    })

    socket.on('removelike', function(postid){
        posts.removePostLike(postid, socket.decoded.id);
        io.emit("removelike", postid.toString())
    })

    socket.on('join', function(room){
        socket.join(room);

        if(room === "global"){
            posts.getAll(socket);
        }

        if(room === "personal"){
            user.getToFriendsRoom(socket.decoded.id, socket)
            posts.getPersonalFeed(socket.decoded.id, socket);
        }

        else{
            posts.getByUser(room, socket)
        }

        console.log(socket.decoded.name + " joined room: " + room)
    })



    socket.on('disconnect', async (reason) => {
        console.log(`User ${socket.decoded.name} has left the main socket. -> ${reason}.`);
        await user.setOffline(socket.decoded.id);
        io.emit("goesoffline", socket.decoded.id);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
