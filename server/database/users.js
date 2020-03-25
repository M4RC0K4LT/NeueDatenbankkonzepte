/**
 * A module that interacts with Redis Database on transactions regarding userdata.
 * @module database/users
 */


/** Import Database */
const db = require('./redis');

//Import NPM Modules to hash passwords and create session tokens 
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
var JWT_KEY = process.env.TOKEN;

module.exports = {

    /**
     * Return all users.
     * @return {JSON} users.
     */
    async getAll() {
        let users = await db.hgetallAsync(individualPath + "user");
        let allusers = [];
        for (user in users) {
            let daten = { "value": user, "id": users[user], "entity": "user" };
            allusers.push(daten)
        }
        return allusers;
    },

    /**
      * Return user by ID.
      * @param {string} id - Searched UserID.
      * @param {socket} socket - Requesting socket.
      */
    async findById(id, socket) {
        let username = await db.hgetAsync(individualPath + "user:" + id, "username");
        if (username == null) {
            return (null)
        }
        let count_posts = await db.zcountAsync(individualPath + 'postByUserID:' + id, -Infinity, +Infinity);
        let count_followers = await db.scardAsync(individualPath + "followers:" + id);
        let count_following = await db.scardAsync(individualPath + "following:" + id);
        let daten = { "id": id, "username": username, "posts": count_posts, "followers": count_followers, "following": count_following };
        socket.emit("getUserDataReturn", JSON.stringify(daten));
    },


    /**
     * Return followed users.
     * @param {string} id - Requesting userID.
     * @param {socket} socket - Requesting socket.
     */
    async getFriends(id, socket) {
        let friendsids = await db.smembersAsync(individualPath + "following:" + id)
        for (friend of friendsids) {
            let frienddata = await db.hgetAsync(individualPath + "user:" + friend, "username")
            let online = await db.sismemberAsync(individualPath + "onlineUsers", friend);
            let unreadchat = await db.sismemberAsync(individualPath + "UserChatsUnread:" + id, friend)
            let data = { "id": friend, "username": frienddata, "online": online, "newmessage": unreadchat }
            socket.emit("returnFriend", JSON.stringify(data));
        }
    },


    /**
     * Login user by mail and password.
     * @param {string} name - Login mailadress.
     * @param {string} password - Unhashed password.
     * @return {JSON} SessionToken, UserID.
     */
    login: (name, password) => {
        return new Promise((resolve, reject) => {
            db.hmget(individualPath + 'user', name, function (err, result) {
                if (err) {
                    return reject(err);
                }
                else {
                    if (result[0] == null) {
                        return reject({ "error": "Ungültige Eingaben" });
                    } else {
                        var id = result[0];
                        db.hgetall(individualPath + 'user:' + id, function (err, result) {
                            if (err) {
                                return reject(err);
                            }
                            if (result != null) {
                                var correct = bcrypt.compareSync(password, result.password);
                                if (correct == true) {
                                    const token = jwt.sign({ "id": id, "name": result.username }, JWT_KEY);
                                    return resolve({ "token": token });
                                } else {
                                    return reject({ "error": "Ungültige Eingaben" })
                                }
                            }
                        });
                    }
                }
            })
        })
    },

    /**
     * Follow another user
     * @param {string} acting_user - User(ID) that wants to follow another user.
     * @param {string} followed_user - User(ID) that should be followed.
     * @param {socket} socket - Requesting socket.
     * @param {io} io - All other connections.
     */
    async follow(acting_user, followed_user, socket, io) {
        await db.saddAsync(individualPath + "following:" + acting_user, followed_user);
        await db.saddAsync(individualPath + "followers:" + followed_user, acting_user);
        let frienddata = await db.hgetAsync(individualPath + "user:" + followed_user, "username")
        let online = await db.sismemberAsync(individualPath + "onlineUsers", followed_user);
        let unreadchat = await db.sismemberAsync(individualPath + "UserChatsUnread:" + acting_user, followed_user)
        let data = { "id": followed_user, "username": frienddata, "online": online, "newmessage": unreadchat }
        socket.emit("returnFriend", JSON.stringify(data));
        io.emit("addfollower", followed_user)
    },

    /**
     * Unfollow another user
     * @param {string} acting_user - User(ID) that wants to follow another user.
     * @param {string} followed_user - User(ID) that should be followed.
     * @param {socket} socket - Requesting socket.
     * @param {io} io - All other connections.
     */
    async unfollow(acting_user, followed_user, socket, io) {

        await db.sremAsync(individualPath + "following:" + acting_user, followed_user);
        await db.sremAsync(individualPath + "followers:" + followed_user, acting_user);
        socket.emit("removeFriend", followed_user);
        io.emit("removefollower", followed_user)
    },

    /**
     * Check if user is following another
     * @param {string} acting_user - User(ID) that wants to follow another user.
     * @param {string} watched_user - User(ID) that should be followed.
     * @param {socket} socket - Requesting socket.
     * @return {int} 1 or 0 (true or false) 
     */
    async isfollowing(acting_user, watched_user, socket) {
        let follows_int = await db.sismemberAsync(individualPath + "following:" + acting_user, watched_user)
        let follows = false;
        if (follows_int == 1) {
            follows = true;
        }
        socket.emit("isfollowingReturn", follows)
    },

    /**
     * Used for personal feed -> all posts of followed users
     * @param {string} acting_user - User(ID) that wants to follow another user.
     * @param {string} socket - User(ID) that should be followed.
     */
    async getToFriendsRoom(acting_user, socket) {
        var friends = await db.smembersAsync(individualPath + "following:" + acting_user);
        for (friend of friends) {
            socket.join(friend);
        }
        return friends;
    },

    /**
     * Set online status of user
     * @param {string} acting_user - User(ID).
     * @return {int} 1 or 0 (true or false) 
     */
    async setOnline(acting_user) {
        var online = await db.saddAsync(individualPath + "onlineUsers", acting_user);
        return online;
    },


    /**
     * Set online status of user to offline
     * @param {string} acting_user - User(ID).
     * @return {int} 1 or 0 (true or false) 
     */
    async setOffline(acting_user) {
        var offline = await db.sremAsync(individualPath + "onlineUsers", acting_user);
        return offline;
    },

    /**
     * Get all users online
     * @return {Array} Users currently online
     */
    async getOnlineUsers() {
        var onlineUsers = await db.smembersAsync(individualPath + "onlineUsers");
        return onlineUsers;
    },



    /**
      * Leave friends socket room
      * @param {string} acting_user - User(ID) acting.
      * @param {socket} socket - Requesting socket.
      */
    async leaveFriendsRoom(acting_user, socket) {
        var friends = await db.smembersAsync(individualPath + "following:" + acting_user);
        for (friend of friends) {
            socket.leave(friend);
        }
        return friends;
    },


    /**
     * Register new user with username, password
     * @param {JSON} jsonObject - Includes new user parameters.
     * @return {JSON} JWT-Token
     */
    create: jsonObject => {
        var password = bcrypt.hashSync(jsonObject.password, 8);
        return new Promise((resolve, reject) => {
            db.hmget(individualPath + 'user', jsonObject.name, function (err, res) {
                if (err) {
                    return reject(err);
                }
                if (res[0] != null) {
                    return reject({ "error": "Username in Verwendung" })
                }
                else {
                    db.incr(individualPath + 'uniqueUserID', function (err, id) {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            db.hmset(individualPath + 'user:' + id, 'username', jsonObject.name, 'password', password, function (err, res) {
                                if (err) {
                                    return reject(err);
                                }
                                db.hmset(individualPath + 'user', jsonObject.name, id, function (err, res) {
                                    if (err) {
                                        return reject(err);
                                    }
                                    db.hgetall(individualPath + 'user:' + id, function (err, res) {
                                        if (err) {
                                            return reject(err)
                                        }
                                        id = id.toString()
                                        const token = jwt.sign({ "id": id, "name": res.username }, JWT_KEY);
                                        return resolve({ "token": token });
                                    })
                                });
                            });
                        }
                    });
                }
            })
        })
    },
};