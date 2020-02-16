const redis = require('redis');
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Create new redis database client -> if you need other connection options, please specify here
const redisClient = redis.createClient({
	url: "rediss://default:gai689ypykqx0fjj@dhbw-wwi-ndbk-do-user-883655-0.db.ondigitalocean.com:25061",
	tls: {},	
});

/**redisClient.incr(individualPath + 'id', function(err, id) {
	redisClient.hmset(individualPath + 'user:' + id, 'username', "nix", "test", "hier", "da", "nur");
	redisClient.hmset(individualPath + 'user', 'username'+id, id);
	console.log(id)
});

console.log(redisClient.hgetall(individualPath + 'user:16', function(err, val) {
	console.log(val)
}))

console.log(redisClient.hgetall(individualPath + 'user', function(err, val) {
	console.log(val)
})) */

module.exports = redisClient;