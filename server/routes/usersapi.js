/**
 * A router module that receives api requests regarding user interaction
 * @module routes/userapi
 */


/** Use Express and basic Router module */
const express = require("express");
const router = express.Router();

/** Database interaction */
//const auth = require("./auth");
const users = require("../database/users");
const multer = require('multer');
const jwt = require('jsonwebtoken');
var JWT_KEY = process.env.TOKEN;

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
        cb(null, "user_" + req.userid + ".png");
    }
})

const postPicPath = multer({storage: postStorage});

const profilePicPath = multer({storage: profileStorage});


router.post('/postPicForm', postPicPath.single('postPic'), function (req, res, next) {
    res.send(req.file);
})

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

/** POST: Login User -> Send Session Token */
router.post('/login', async function(request, response) {
    try {
        const login = await users.login(request.body.name, request.body.password);
        let data = Object.assign({"request": "successful"}, login)
        response.status(200).send(data);       
    } catch (err) {
        console.log(err)
        let data = Object.assign({"request": "failed"}, err)
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

module.exports = router;