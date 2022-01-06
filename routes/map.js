var express = require('express');
var router = express.Router();

var map_controller = require('../controllers/mapController');

router.get('/', map_controller.index);

module.exports = router;
