var express = require('express');
var router = express.Router();

var map_controller = require('../controllers/mapController');

router.get('/', map_controller.index);
// router.get('/api/populateDb', map_controller.populateDb);
router.get('/api/countries', map_controller.getCountries);

module.exports = router;
