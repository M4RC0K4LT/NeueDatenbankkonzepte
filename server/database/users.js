/**
 * A module that interacts with SQLite Database on transactions regarding userdata.
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
   * @return {Array} Full of single "UserJSONs". Currently not in use.
  
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT user_id, user_name, user_mail FROM users`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
 
 
  /**
   * Return user by mail. Currently just for existing mail check on user creation/update.
   * @param {string} mail - Searched mailadress.
   * @return {JSON} Userdata.
 
  findByMail: mail => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE user_mail = $mail`, {$mail: mail}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
 
 
  /**
   * Return user by username. Currently just for existing username check on user creation/update.
   * @param {string} username - Searched username.
   * @return {JSON} Userdata.
 
  findByName: username => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE user_name = $username`, {$username: username}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
 
 
  /**
   * Return user by ID.
   * @param {string} id - Searched UserID.
   * @return {JSON} Userdata.
 
  findById: id => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
 
 
  /**
   * Return user by token. Used for returning own userdata in profile,... - based on Bearer Token (has to be splitted before).
   * @param {string} token - Searched Token.
   * @return {JSON} Userdata with ! passwordhash !.
 
  findByToken: token => {
    return jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
        return ({"request": "failed", "error": err.message});
      }
      user = await module.exports.findById(parseInt(userid));
      if(user == null || user.user_tokens != token){
        return ({"request": "failed", "error": "Kein gültiger UserToken"})
      }  
      return ({"request": "successful", "user_id": user.user_id, "user_name": user.user_name, "user_mail": user.user_mail, "user_password": user.user_password}); 
    });
    
     
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
          if (result == null) {
            return reject({ "error": "Ungültige Eingaben" });
          } else {
            var id = result[0];
            db.hgetall(individualPath + 'user:' + id, function (err, result) {
              if (err) {
                return reject(err);
              }
              console.log(result)
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
   * @return {}  
   */
  follow(acting_user, followed_user) {

    return new Promise((resolve, reject) => {
      db.sadd(individualPath + "following:" + acting_user, followed_user, function (err, res) {
        if (err) {
          return reject(err)
        }
        db.sadd(individualPath + "followers:" + followed_user, acting_user, function (err, res) {
          if (err) {
            return reject(err)
          }
          resolve(res)
        })
      })
    })
  },

  /**
   * Unfollow another user
   * @param {string} acting_user - User(ID) that wants to follow another user.
   * @param {string} followed_user - User(ID) that should be followed.
   * @return {}  
   */
  unfollow(acting_user, followed_user) {

    return new Promise((resolve, reject) => {
      db.srem(individualPath + "following:" + acting_user, followed_user, function (err, res) {
        if (err) {
          return reject(err)
        }
        db.srem(individualPath + "followers:" + followed_user, acting_user, function (err, res) {
          if (err) {
            return reject(err)
          }
          resolve(res)
        })
      })
    })
  },

  /**
   * Follow another user
   * @param {string} acting_user - User(ID) that wants to follow another user.
   * @param {string} watched_user - User(ID) that should be followed.
   * @return {int} 1 or 0 (true or false) 
   */
  isfollowing(acting_user, watched_user) {

    return new Promise((resolve, reject) => {
      db.sismember(individualPath + "following:" + acting_user, watched_user, function (err, res) {
        if (err) {
          return reject(err)
        }
        resolve(res)
      })
    })
  },

  /**
   * Follow another user
   * @param {string} acting_user - User(ID) that wants to follow another user.
   * @param {string} socket - User(ID) that should be followed.
   * @return {int} 1 or 0 (true or false) 
   */
  async getToFriendsRoom(acting_user, socket) {
    var friends = await db.smembersAsync(individualPath + "following:" + acting_user);
    for (friend of friends) {
      socket.join(friend);
    }
    return friends;
  },

  /**
    * Follow another user
    * @param {string} acting_user - User(ID) that wants to follow another user.
    * @param {string} socket - User(ID) that should be followed.
    * @return {int} 1 or 0 (true or false) 
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


  /**
   * Update existing user data by ID.
   * @param {string} id - UserID to change.
   * @param {JSON} jsonObject - Updated Values.
   * @return {JSON} Updated UserData.
  update: (id, jsonObject) => {  
    var password = bcrypt.hashSync(jsonObject.password, 8);
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        
        db.run(
            
          `UPDATE users SET user_name = $name, user_mail = $mail, user_password = $password WHERE user_id = $id`, 
          {
            $name: jsonObject.name,
            $mail: jsonObject.mail,
            $password: password,
            $token: jsonObject.token,
            $id: id
          },
          function (err) {
            if (err) {
              reject({"error": err.message});
            }
            db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
              if (err) {
                reject({"error": err.message});
              } else {
                resolve(result);
              }
            });
          }
        )
    });
  },
 
 
  /**
   * Remove user by ID. Currently not in use
   * @param {string} id - UserID to remove correct oject.
   * @return {Boolean} Success - yes or no.
 
  remove: id => {
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
            if (err) {
              reject({"error": err.message});
            } else {
              if (result != null){
                db.run(          
                    `DELETE FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
                      if (err) {
                        reject(false);
                      } else {
                        resolve(true);
                      }
                });
              } else{
                  reject({"error": "Kein gültiger User"});
              }
            }
          });      
    });
  }, */
};