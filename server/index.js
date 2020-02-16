const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
require("dotenv").config()

individualPath = "gruppe-kann-nix-40-";

const db = require('./database/redis');

const userapi = require("./routes/usersapi");

//const postsapi = require('./routes/postsapi'); -> Not used
//app.use("/post", postsapi);

const cors = require('cors')
app.use(cors());
app.options('*', cors())

app.use(bodyParser.json());
app.use("/user", userapi);


app.get('/', (req, res) => {
    res.send('It works!');
});

const posts = require('./database/posts');

const socketauth = require("./routes/auth");

io.use(socketauth)

io.on('connection', socket => {

    console.log(`User ${socket.decoded.name} connected to main socket.`);
    

    // Wait for post event
    socket.on('new globalpost', async postAsJson => {
        const post = JSON.parse(postAsJson);

        // Save post in redis
        await posts.create(post);

        // Send Post to everyone
        io.sockets.in("global").emit('post', JSON.stringify(post));
        io.sockets.in(socket.decoded.id).emit('post', JSON.stringify(post));
    });

    socket.on('leave', function(room){
        socket.leave(room)
        console.log(socket.decoded.name + " left room: " + room)
    })
    
    socket.on('join', function(room){
        socket.join(room);

        if(room === "global"){
            posts.getAll(socket);
        }

        else{
            posts.getByUser(room, socket)
        }

        console.log(socket.decoded.name + " joined room: " + room)
    })



    socket.on('disconnect', (reason) => {
        console.log(`User ${socket.decoded.name} has left the main socket. -> ${reason}.`);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
