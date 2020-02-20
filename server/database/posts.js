/** Import Database */
const db = require('./redis');

module.exports = {

    async getAll(socket){
        let postJsonStrings = await db.zrangeAsync(individualPath + 'post', 0, -1, "WITHSCORES");
        for(postID of postJsonStrings){
            let postdata = await db.hgetallAsync(individualPath + "post:" + postID)
            if(postdata != null){                
                let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postID, socket.decoded.id)
                let liked = false;
                if(hasLiked === 1){
                    liked = true;
                }
                let daten = Object.assign({"postid": postID, "liked": liked}, postdata);
                socket.emit('post', JSON.stringify(daten));
                
            }
        }          
    },

    async getByUser(id, socket){
        let postJsons = await db.zrangeAsync(individualPath + 'postByUserID:' + id, 0, -1)
        for(postID of postJsons){        
            let postdata = await db.hgetallAsync(individualPath + "post:" + postID)
            if(postdata != null){                
                let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postID, socket.decoded.id)
                let liked = false;
                if(hasLiked === 1){
                    liked = true;
                }
                let daten = Object.assign({"postid": postID, "liked": liked}, postdata);
                socket.emit('post', JSON.stringify(daten));                
            }    
        }
    },

    create: jsonObject => {
        return new Promise((resolve, reject) => {
            db.incr(individualPath + 'uniquePostID', function(err, uniquePostID) {
                if (err) {
                    return reject(err);
                } else {
                    db.hmset(individualPath + 'post:' + uniquePostID, 'username', jsonObject.username, 'timestamp', jsonObject.timestamp, 'content', jsonObject.content, 'userid', jsonObject.userid, 'likes', 0,  function (err, res) {
                        if (err) {
                            return reject(err);
                        }
                        db.zadd(individualPath + 'post', jsonObject.timestamp, uniquePostID, function (err, res) {
                            if (err) {
                                return reject(err);
                            }
                            db.zadd(individualPath + 'postByUserID:' + jsonObject.userid, jsonObject.timestamp, uniquePostID, function(err, res) {
                                if(err){
                                    return reject(err);
                                }
                                return resolve(uniquePostID);
                            })
                        })
                    })
                }
            });
        });
    },

    async createPrivatePost(sender, friend, message, io, otheruserinchat) {
        let smaller_userid = null;
        let higher_userid = null;
        if(sender<friend){
            smaller_userid = sender;
            higher_userid = friend;
        }else {
            smaller_userid = friend;
            higher_userid = sender;
        }
        let now = Date.now();
        let user1chats = await db.zaddAsync(individualPath + "UserChats:" + sender, friend, now);
        let user2chats = await db.zaddAsync(individualPath + "UserChats:" + friend, sender, now);
        if(!otheruserinchat){
            await db.saddAsync(individualPath + "UserChatsUnread:" + friend, sender)
            io.sockets.in("privatemessages-" + friend).emit("newmessage", sender);
        }
        let test = await db.zaddAsync(individualPath + "privateChat:" + smaller_userid + "-" + higher_userid, now, JSON.stringify({"id": sender, "message": message}));
        io.sockets.in("private-" + smaller_userid + "-" + higher_userid).emit("post", JSON.stringify({"sender": sender, "message": message, "timestamp": now}))
    },

    async setPrivateMessagesRead(friend, socket){
        await db.sremAsync(individualPath + "UserChatsUnread:" + socket.decoded.id, friend)
        socket.emit("newmessageread", friend);
    },

    async getPreviousPrivatePosts(requestingid, friend, socket){
        let smaller_userid = null;
        let higher_userid = null;
        if(requestingid<friend){
            smaller_userid = requestingid;
            higher_userid = friend;
        }else {
            smaller_userid = friend;
            higher_userid = requestingid;
        }
        let posts_withtimestamp = await db.zrangeAsync(individualPath + "privateChat:" + smaller_userid + "-" + higher_userid, 0, -1, "WITHSCORES");
        for (i = 0; i < posts_withtimestamp.length; i++) {
            let content = JSON.parse(posts_withtimestamp[i]);
            let sender = content.id;
            let message = content.message;
            let timestamp = posts_withtimestamp[i+1];
            socket.emit("post", JSON.stringify({"sender": sender, "message": message, "timestamp": timestamp}))
            i++;

        }

    },

    async getPersonalFeed(user, socket){
        var oldposts = [];
        var users_following = await db.smembersAsync(individualPath + "following:" + user)
        for(userid of users_following){
            var all_user_posts_id = await db.zrangebyscoreAsync(individualPath + 'postByUserID:' + userid, -Infinity, +Infinity);
            for(postid of all_user_posts_id){
                oldposts.push(postid);
            }
        }
        var sorted_postIDs = oldposts.sort();
        for(postid of sorted_postIDs){
            var post = await db.hgetallAsync(individualPath + "post:" + postid)
            let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postid, socket.decoded.id)
            let liked = false;
            if(hasLiked === 1){
                liked = true;
            }
            let daten = Object.assign({"postid": postid, "liked": liked}, post);
            socket.emit('post', JSON.stringify(daten)); 
        }

        return oldposts
        
    },

    likePost(postid, userid){
        db.sadd(individualPath + 'PostLikes:' + postid, userid, function(err, res){
            if(err){
                return err;
            }
            db.scard(individualPath + 'PostLikes:' + postid, function(err, res){
                if(err){
                    return err;
                }
                db.hmset(individualPath + "post:" + postid, "likes", res, function(err, res){
                    if(err){
                        return err;
                    }
                })
            })
        })
    },

    removePostLike(postid, userid){
        db.srem(individualPath + 'PostLikes:' + postid, userid, function(err, res){
            if(err){
                return err;
            }
            db.scard(individualPath + 'PostLikes:' + postid, function(err, res){
                if(err){
                    return err;
                }
                db.hmset(individualPath + "post:" + postid, "likes", res, function(err, res){
                    if(err){
                        return err;
                    }
                })
            })
        })
    }
}