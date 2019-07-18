const config = require('../config/config')
const {promisify} = require('util');

const redis = require("redis")
const client = redis.createClient(config.redis.port, config.redis.host)
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);

const getData = async (key) => res = await getAsync(key)
const delData = async (key) => res = await delAsync(key)

module.exports = {
    redis,
    client,
    getData,
    delData
}