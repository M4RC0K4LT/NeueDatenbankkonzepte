/**
 * A router module that receives api requests regarding user interaction
 * @module routes/userapi
 */

/** Use Express and basic Router module */
const express = require("express");
const router = express.Router();
const uuidv4 = require('uuid/v4');

/** Database interaction */
const users = require("../database/users");
const posts = require("../database/posts");

/** Optional packages for image upload and jsonWebTokens */
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
var JWT_KEY = process.env.TOKEN;

/** Storage location for Post-Images */
const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, "./public/postPics");
    },
    filename: function (req, file, cb) {
        req.new_filename = req.unique_pic_id + "." + file.originalname.split(".").slice(-1)[0].toLowerCase();
        cb(null, req.new_filename);
    }
})

/** Storage location for Profile-Images */
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, "./public/profilePics");
    },
    filename: function (req, file, cb) {
        cb(null, "user_" + req.userid + ".png");
    }
})

const postPicPath = multer({storage: postStorage});
const profilePicPath = multer({storage: profileStorage});


/** Route for posting Post-Image */
router.post('/postPicForm', function(req,res){
    req.unique_pic_id = uuidv4();
    var upload = postPicPath.single('postPic');
    upload(req,res,function(err) {
        if(err) {
            return res.send({"request": "failed", "error": err});
        }
        res.send({"request": "successful", "uuid": req.new_filename});
    });
})

/** Route for posting Profile-Image */
router.post('/profilePicForm', function(req,res){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let id = null;
    jwt.verify(token, JWT_KEY, function(err, decoded) {
        if(err) {
            return res.send({"request": "failed", "error": err});
        }
        id = decoded.id;
    });
    req.userid = id;
    var upload = profilePicPath.single('profilePic');
    upload(req,res,function(err) {
        if(err) {
            return res.send({"request": "failed", "error": err});
        }
        res.send({"request": "successful"});
    });
})

/** Route for removing Profile-Image */
router.post('/delProfilePic', function(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let id = null;
    jwt.verify(token, JWT_KEY, function(err, decoded) {
        if(err) {
            return res.send({"request": "failed", "error": err});
        }
        id = decoded.id;
    });
    req.userid = id;
    fs.unlink("../server/public/profilePics/user_" + id + ".png", function(err) {
        if (err) {
           return res.send({"request": "failed", "error": err});
        }
    })
})

/** POST: Login User -> Send Session Token */
router.post('/login', async function(request, response) {
    try {
        const login = await users.login(request.body.name, request.body.password);
        let data = Object.assign({"request": "successful"}, login)
        response.status(200).send(data);       
    } catch (err) {
        console.log(err)
        let data = Object.assign({"request": "failed"}, err);
        response.status(500).send(data);
    }
});

/** POST: Register new User */
router.post('/register', async function(request, response) {
    try {
        const user = await users.create(request.body);       
        let data = Object.assign({"request": "successful"}, user)
        return response.status(201).send(data);
    }
    catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
});

/** POST: Register new User */
router.get('/search', async function(request, response) {
        const user = await users.getAll();  
        const post = await posts.getAllHashtags();  
        return response.status(200).send(JSON.stringify(user.concat(post)));
});

module.exports = router;