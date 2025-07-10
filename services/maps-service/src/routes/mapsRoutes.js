const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/mapsController');

router.get('/', mapsController.getMapsServiceStatus);
router.get('/redis-test', mapsController.getRedisTest);

module.exports = router;
