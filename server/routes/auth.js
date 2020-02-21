/**
 * A module that checks authorization token on socket connection.
 * Used as express middleware.
 * Rejects if token is not valid.
 * @module routes/auth
 */

/** Import NPM-Module to decode and check authorization token */
const jwt = require('jsonwebtoken');
var JWT_KEY = process.env.TOKEN;


/** Authenticate a socket connection */
function auth(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, JWT_KEY, function(err, decoded) {
            if(err) {
                return next(new Error('Authentication error'));
            }
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }    
}

/**
 * Socket authorization.
 * @param {socket} socket - Current socket.
 * @param {next} next - Middleware parameter
 * @return {next} If socket is authorized. Otherwise returns error.
 */
module.exports = auth