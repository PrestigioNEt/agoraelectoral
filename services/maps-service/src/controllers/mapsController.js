const redisClient = require('../config/redis');

exports.getMapsServiceStatus = (req, res) => {
    res.send('Maps Service is running!');
};

exports.getRedisTest = async (req, res) => {
    try {
        await redisClient.incr('maps_service_counter');
        const counter = await redisClient.get('maps_service_counter');
        res.send(`Maps Service Redis counter: ${counter}`);
    } catch (error) {
        res.status(500).send(`Redis error: ${error.message}`);
    }
};
