const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
require("dotenv").config()

individualPath = "gruppe-kann-nix-34-";

const db = require('./database/redis');

const userapi = require("./routes/usersapi");
const postsapi = require('./routes/postsapi');


app.use(bodyParser.json());
app.use("/user", userapi);
app.use("/post", postsapi);

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', socket => {

    console.log(`Socket ${socket.id} connected.`);

    // After initial connection, send all existing posts to the user
    db.lrange('121-wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse all JSON strings, emit to client
        const objects = postJsonStrings.map(string => JSON.parse(string));
        socket.emit('previous posts', JSON.stringify(objects));
    });

    // Wait for post event
    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);
        // Save post in redis
        db.rpush('121-wwi-tweety-posts', JSON.stringify(post));

        // Send Post to everyone
        io.emit('post', JSON.stringify(post));
    });

    socket.on('disconnect', (reason) => {
        console.log(`Socket ${socket.id} disconnected -> ${reason}.`);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
