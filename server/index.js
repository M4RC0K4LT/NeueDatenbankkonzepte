const express = require("express");
const app = express();

/** Individual database path as prefix of all entries */
individualPath = "gruppe-kann-nix-52-";

/** Optional Packages */
const http = require("http").createServer(app);
const bodyParser = require('body-parser');
require("dotenv").config()

/** Cors options */
const cors = require('cors')
app.use(cors());
app.options('*', cors())

/** Initialize Sockets for communication */
const basic_sockets = require('./routes/sockets');
basic_sockets.initializeSockets(http)

/** Initialize API Requests (just for login, register, profile-picture ) */
const userapi = require("./routes/usersapi");
app.use(bodyParser.json());
app.use("/user", userapi);

/** Express serve static files */ 
app.use('/profilePics', express.static(__dirname + '/public/profilePics'));
app.use('/postPics', express.static(__dirname + '/public/postPics'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/** Express start Backend-Server */
http.listen(3000, function () {
    console.log('listening on *:3000');
});
