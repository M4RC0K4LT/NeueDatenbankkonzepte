/**
 * A module that checks authorization header on API request.
 * Used as express middleware.
 * Rejects if token does not belong to a user or if none is given.
 * @module routes/auth
 */

/** Import NPM-Module to decode and check authorization header */
const jwt = require('jsonwebtoken');
var JWT_KEY = process.env.TOKEN;



/** Authenticate a API request */
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
 * API request authorization.
 * @param {request} request - API request.
 * @param {response} response - API response.
 * @param {next} next - Middleware parameter
 * @return {next} If request is authorized. Otherwise returns Response.
 */
module.exports = auth