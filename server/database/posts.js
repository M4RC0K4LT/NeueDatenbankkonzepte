/** Import Database */
const db = require('./redis');
var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify);
var linkifyHtml = require('linkifyjs/html');

module.exports = {

    async getAll(socket){
        let postJsonStrings = await db.zrangeAsync(individualPath + 'post', 0, -1, "WITHSCORES");
        let previousPosts = [];
        for(postID of postJsonStrings){
            let postdata = await db.hgetallAsync(individualPath + "post:" + postID)
            if(postdata != null){                
                let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postID, socket.decoded.id)
                let liked = false;
                if(hasLiked === 1){
                    liked = true;
                }
                let daten = Object.assign({"postid": postID, "liked": liked}, postdata);
                previousPosts.unshift(daten);                
            }
        }    
        socket.emit('previous posts', previousPosts);      
    },

    async getByUser(id, socket){
        let postJsons = await db.zrangeAsync(individualPath + 'postByUserID:' + id, 0, -1)
        let previousPosts = [];
        for(postID of postJsons){        
            let postdata = await db.hgetallAsync(individualPath + "post:" + postID)
            if(postdata != null){                
                let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postID, socket.decoded.id)
                let liked = false;
                if(hasLiked === 1){
                    liked = true;
                }
                let daten = Object.assign({"postid": postID, "liked": liked}, postdata);
                previousPosts.unshift(daten);               
            }    
        }
        socket.emit('previous posts', previousPosts); 
    },

    async getByHashtag(hashtag, socket){
        let postIDs = await db.zrangeAsync(individualPath + "hashtag:" + hashtag, 0, -1);
        let used = await db.zscore(individualPath + "hashtags", hashtag);
        let previousPosts = []
        socket.emit("hastag used", used);
        for(postID of postIDs){        
            let postdata = await db.hgetallAsync(individualPath + "post:" + postID)
            if(postdata != null){                
                let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postID, socket.decoded.id)
                let liked = false;
                if(hasLiked === 1){
                    liked = true;
                }
                let daten = Object.assign({"postid": postID, "liked": liked}, postdata);
                previousPosts.unshift(daten)              
            }    
        }
        socket.emit('previous posts', previousPosts);  
    },

    async getAllHashtags(){
        let hashtags = await db.zrangeAsync(individualPath + "hashtags", 0, -1)
        let allhashtags = [];
        for(hashtag of hashtags){
            let daten = {"value": "#" + hashtag, "entity": "hashtag"};
            allhashtags.push(daten)
        }
        return allhashtags;
    },

    async getMostUsedHashtags(socket){
        let mostHashtags = await db.zrangeAsync(individualPath + "hashtags", 0, 10, "WITHSCORES");
        socket.emit("hashtagstats", mostHashtags);
    },

    async create(jsonObject, socket, io){
        let now = Date.now();
        let pic = jsonObject.picture;        
        if(pic == undefined){
            pic = "";
        }
        let uniquePostID = await db.incrAsync(individualPath + 'uniquePostID');
        let setPost = await db.hmsetAsync(individualPath + 'post:' + uniquePostID, 'username', socket.decoded.name, 'timestamp', now, 'content', jsonObject.content, 'userid', socket.decoded.id, 'likes', 0, 'picture', pic)
        let toAllPosts = await db.zaddAsync(individualPath + 'post', now, uniquePostID)
        let toUsersPosts = await db.zaddAsync(individualPath + 'postByUserID:' + socket.decoded.id, now, uniquePostID)
        let newpost = Object.assign({"postid": uniquePostID, "liked": false, "likes": "0", 'username': socket.decoded.name, 'timestamp': now, 'userid': socket.decoded.id, 'picture': pic}, jsonObject);
        let linkifyFound = linkify.find(jsonObject.content)
        for(found of linkifyFound){
            if(found.type == "hashtag"){
                let value = found.value.slice(1);
                let toAllHashtags = await db.zincrbyAsync(individualPath + 'hashtags', 1, value);
                let toHashtagList = await db.zaddAsync(individualPath + "hashtag:" + value, now, uniquePostID);
                io.sockets.in("hashtag-" + value).emit("post", JSON.stringify(newpost));
            }
        }
        io.sockets.in("global").emit('post', JSON.stringify(newpost));
        io.sockets.in(socket.decoded.id).emit('post', JSON.stringify(newpost));
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
        let prevMessages = [];
        for (i = 0; i < posts_withtimestamp.length; i++) {
            let content = JSON.parse(posts_withtimestamp[i]);
            let sender = content.id;
            let message = content.message;
            let timestamp = posts_withtimestamp[i+1];
            prevMessages.push({"sender": sender, "message": message, "timestamp": timestamp})
            i++;
        }
        socket.emit("previous posts", prevMessages)

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
        let previousPosts = [];
        for(postid of sorted_postIDs){
            var post = await db.hgetallAsync(individualPath + "post:" + postid)
            let hasLiked = await db.sismemberAsync(individualPath + "PostLikes:" + postid, socket.decoded.id)
            let liked = false;
            if(hasLiked === 1){
                liked = true;
            }
            let daten = Object.assign({"postid": postid, "liked": liked}, post);
            previousPosts.unshift(daten)
        }
        socket.emit('previous posts', previousPosts); 
        
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