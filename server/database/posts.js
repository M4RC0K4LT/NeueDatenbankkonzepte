/** Import Database */
const db = require('./redis');

module.exports = {

    getAll(socket){
        db.zrange(individualPath + 'post', 0, -1, (err, postJsonStrings) => {
            if (err) {
                return (err);
            } else { 
                for(data in postJsonStrings){
                    db.hgetall(individualPath + "post:" + data, function(err, res){
                        if(err){
                            return err;
                        }
                        if(res != null){
                            socket.emit('post', JSON.stringify(res));
                        }
                    });
                }          
            }
        })
    },

    create: jsonObject => {
        return new Promise((resolve, reject) => {
            db.incr(individualPath + 'uniquePostID', function(err, uniquePostID) {
                if (err) {
                    return reject(err);
                } else {
                    console.log(uniquePostID)
                    db.hmset(individualPath + 'post:' + uniquePostID, 'username', jsonObject.username, 'timestamp', jsonObject.timestamp, 'content', jsonObject.content, function (err, res) {
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
                                return resolve();
                            })
                        })
                    })
                }
            });
        });
    }
}