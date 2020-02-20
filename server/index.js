//const app = require('express') ();
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const multer = require('multer');
require("dotenv").config()

individualPath = "gruppe-kann-nix-52-";

const db = require('./database/redis');

const userapi = require("./routes/usersapi");

//const postsapi = require('./routes/postsapi'); -> Not used
//app.use("/post", postsapi);

// Express serve static files
app.use('/profilePics', express.static(__dirname + '/public/profilePics'));
app.use('/postPics', express.static(__dirname + '/public/postPics'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Something went wrong");
};

const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, "./public/postPics");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, "./public/profilePics");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const postPicPath = multer({storage: postStorage});

const profilePicPath = multer({storage: profileStorage});


app.post('/postPicForm', postPicPath.single('postPic'), function (req, res) {
    res.send(req.file);
    // req.file is postPic file
    // req.body hold text fields, if there were any
})

app.post('/profilePicForm', profilePicPath.single('profilePic'), function (req, res) {
    res.send(req.file);
    // req.file is postPic file
    // req.body hold text fields, if there were any
})

/*app.post('/postPic', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of 'photos files
    // req.body contain text fields, if there were any
})*/

/*var cpUpload = upload.fields([{ name: 'postPic', maxCount: 1 }])
app.post('/postPic', cpUpload, function (req, res, next) {
    // req.files is object (String -> Array) where fieldname is key and value is array of files
    // e.g. req.files['gallery'] -> Array
    // e.g. req.files['avatar'][0] -> File
    // req.body contain text fields, if there were any
})*/



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

    socket.on("new privatepost", async function(postAsJson){
        const post = JSON.parse(postAsJson);
        let smaller_userid = socket.decoded.id;
        let higher_userid = post.friendsid;
        if(socket.decoded.id>post.friendsid){
            smaller_userid = post.friendsid;
            higher_userid = socket.decoded.id
        }
        let room = io.sockets.adapter.rooms["private-" + smaller_userid + "-" + higher_userid];
        let other_user_online = false;
        if(room != null){
            if(room.length == 1){
                other_user_online = true;
            }
        }
        await posts.createPrivatePost(socket.decoded.id, post.friendsid, post.message, io, other_user_online)
    })

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

    socket.on('join private', async function(otherid){
        
        if(socket.decoded.id<otherid){
            socket.join("private-" + socket.decoded.id + "-" + otherid);
        } else {
            socket.join("private-" + otherid + "-" + socket.decoded.id);
        }
        await posts.getPreviousPrivatePosts(socket.decoded.id, otherid, socket)
    })

    socket.on('leave private', async function(otherid){
        if(socket.decoded.id<otherid){
            socket.leave("private-" + socket.decoded.id + "-" + otherid);
        } else {
            socket.leave("private-" + otherid + "-" + socket.decoded.id);
        }
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

    socket.on("getMyFriends", () => {
        user.getFriends(socket.decoded.id, socket)
    })

    socket.on("follow", (id) => {
        user.follow(socket.decoded.id, id, socket, io);
    })

    socket.on("unfollow", (id) => {
        user.unfollow(socket.decoded.id, id, socket, io)
    })

    socket.on("isfollowing", (id) => {
        user.isfollowing(socket.decoded.id, id, socket)
    })

    socket.on("getUserData", (id) => {
        user.findById(id, socket)
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
