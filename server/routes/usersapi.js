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


/** GET: Current User`s data
router.get('/all', auth, async function(request, response) {
    try {
        const usersdata = await users.getAll()
        return response.status(200).send(usersdata);
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
});

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

/** DELETE: Logout -> Delete Session Token <- Just pre-implementation for "real", unique SessionTokens (Logout works without this request)
router.delete('/logout', auth, async function(request, response){
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const user = await users.logout(token);
        let data = Object.assign({"request": "successful"}, user)
        response.status(200).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
});

/** PUT: Update UserData
router.put('/change', auth, async function(request, response) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const userdetail = await users.findByToken(token);
        if(userdetail.request === "failed"){
            return response.status(500).send(userdetail);
        }

        const existsname = await users.findByName(request.body.name)
        const existsmail = await users.findByMail(request.body.mail)

        if(existsname != null && existsname.user_id != userdetail.user_id){
            return response.status(500).send({"request": "failed", "error": "Username schon vergeben"});
        }        
        if(existsmail != null && existsmail.user_id != userdetail.user_id){
            return response.status(500).send({"request": "failed", "error": "Mailadresse schon registriert"});
        }

        const user = await users.update(userdetail.user_id, request.body);
        let data = Object.assign({"request": "successful"}, user)
        response.status(201).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
});  */

module.exports = router;