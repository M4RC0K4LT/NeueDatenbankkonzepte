const redis = require('redis');
const bluebird = require('bluebird')

// Possibility to make Async requests to redis database 
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Create a new redis database client
const redisClient = redis.createClient({
	url: "rediss://default:gai689ypykqx0fjj@dhbw-wwi-ndbk-do-user-883655-0.db.ondigitalocean.com:25061",
	tls: {},	
});

module.exports = redisClient;