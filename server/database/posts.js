/** Import Database */
const db = require('./redis');

module.exports = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.hmgetall(individualPath + 'post', function (err, result) {
                if (err) {
                    return reject(err);
                } else {
                    if (result == null) {
                        return reject({"error": "Tweets nicht gefunden"});
                    } else {
                        return resolve;
                    }
                }
            })
        })
    },



    create: jsonObject => {
        return new Promise((resolve, reject) => {
            db.hmget(individualPath + 'post', jsonObject.id, function (err, res) {
                if (err) {
                    return reject(err);
                }
                if (res[0] != null) {
                    return reject({"error": "ID in Verwendung"})
                } else {
                    db.incr(individualPath + 'uniquePostID', function(err, uniquePostID) {
                        if (err) {
                            return reject(err);
                        } else {
                            db.hmset(individualPath + 'post:' + uniquePostID, 'username', jsonObject.username, 'timestamp', jsonObject.timestamp, 'content', jsonObject.content, function (err, res) {
                                if (err) {
                                    return reject(err);
                                }
                                db.hmset(individualPath + 'post', jsonObject.username, uniquePostID, function (err, res) {
                                    if (err) {
                                        return reject(err);
                                    }
                                    db.hgetall(individualPath + 'post:' + uniquePostID, function (err, res) {
                                        if (err) {
                                            return reject(err);
                                        }
                                    })
                                })
                            })
                        }
                    });
                }
            });
        });
    }
}