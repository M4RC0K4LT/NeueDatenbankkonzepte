const posts = require('../database/posts');
const user = require('../database/users');
const socketauth = require("../routes/auth");

module.exports = {

    initializeSockets(http){

        const io = require('socket.io')(http);
        
        /** Authorize user before using a socket */
        io.use(socketauth)
    
        /** Start SocketIO instance */
        io.on('connection', async socket => {
    
            console.log(`User ${socket.decoded.name} connected to main socket.`);
            await user.setOnline(socket.decoded.id);
            io.emit("goesonline", socket.decoded.id)
            socket.join("privatemessages-" + socket.decoded.id)
    
            /** Listener for GlobalFeed Posts */
            socket.on('new globalpost', async postAsJson => {
                const post = JSON.parse(postAsJson);
                var id = await posts.create(post);
                let newpost = Object.assign({"postid": id.toString(), "liked": false, "likes": "0"}, post);
                io.sockets.in("global").emit('post', JSON.stringify(newpost));
                io.sockets.in(socket.decoded.id).emit('post', JSON.stringify(newpost));
            });
    
            /** Listener for new private messages */
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
                    if(room.length > 1){
                        other_user_online = true;
                    }
                }
                await posts.createPrivatePost(socket.decoded.id, post.friendsid, post.message, io, other_user_online)
            })
    
            /** Listener for SocketIO room joining */
            socket.on('join', function(room){
                socket.join(room);
                if(room === "global"){
                    posts.getAll(socket);
                }
                if(room === "personal"){
                    user.getToFriendsRoom(socket.decoded.id, socket);
                    posts.getPersonalFeed(socket.decoded.id, socket);
                }   
                else{
                    posts.getByUser(room, socket)
                }
                console.log(socket.decoded.name + " joined room: " + room)
            })

            /** Listener for SocketIO room leaving */
            socket.on('leave', function(room){
                if(room === "followers"){
                    user.leaveFriendsRoom(socket.decoded.id, socket);
                }else {
                    socket.leave(room)
                    console.log(socket.decoded.name + " left room: " + room)
                }      
            })
    
            /** Listener for PrivateChatRoom join */
            socket.on('join private', async function(otherid){
                
                if(socket.decoded.id<otherid){
                    socket.join("private-" + socket.decoded.id + "-" + otherid);
                } else {
                    socket.join("private-" + otherid + "-" + socket.decoded.id);
                }
                await posts.setPrivateMessagesRead(otherid, socket)
                await posts.getPreviousPrivatePosts(socket.decoded.id, otherid, socket)
            })

            /** Listener for PrivateChatRoom leave */
            socket.on('leave private', async function(otherid){
                if(socket.decoded.id<otherid){
                    socket.leave("private-" + socket.decoded.id + "-" + otherid);
                } else {
                    socket.leave("private-" + otherid + "-" + socket.decoded.id);
                }
            })

            /** Listener for new Like on Post */
            socket.on('like', function(postid){
                posts.likePost(postid, socket.decoded.id);
                io.emit("newlike", postid.toString())
            })
    
            /** Listener for removed Like on Post */
            socket.on('removelike', function(postid){
                posts.removePostLike(postid, socket.decoded.id);
                io.emit("removelike", postid.toString())
            })
    
            /** Listener to return all friends/users followed */
            socket.on("getMyFriends", () => {
                user.getFriends(socket.decoded.id, socket)
            })
    
            /** Listener for a new follow */
            socket.on("follow", (id) => {
                user.follow(socket.decoded.id, id, socket, io);
            })
    
            /** Listener for a unfollow */
            socket.on("unfollow", (id) => {
                user.unfollow(socket.decoded.id, id, socket, io)
            })
    
            /** Listener to requeset if user folllows another */
            socket.on("isfollowing", (id) => {
                user.isfollowing(socket.decoded.id, id, socket)
            })
    
            /** Returns all user-specific data found on profile */
            socket.on("getUserData", (id) => {
                user.findById(id, socket)
            })
    
            /** Listener for socketIO disconnections */
            socket.on('disconnect', async (reason) => {
                console.log(`User ${socket.decoded.name} has left the main socket. -> ${reason}.`);
                await user.setOffline(socket.decoded.id);
                io.emit("goesoffline", socket.decoded.id);
            });
    
        });
    }
}