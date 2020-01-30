const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redis = require('redis');

// Create new redis database client -> if you need other connection options, please specify here
const redisClient = redis.createClient({
	url: "rediss://default:gai689ypykqx0fjj@dhbw-wwi-ndbk-do-user-883655-0.db.ondigitalocean.com:25061",
	tls: {},
	
});

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', socket => {
    console.log('a user connected');

    // After initial connection, send all existing posts to the user
    redisClient.lrange('101-wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse all JSON strings, emit to client
        const objects = postJsonStrings.map(string => JSON.parse(string));
        socket.emit('previous posts', JSON.stringify(objects));
    });

    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);

        // Save post in redis
        redisClient.rpush('101-wwi-tweety-posts', JSON.stringify(post));

        // Send Post to everyone
        io.emit('post', JSON.stringify(post));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
