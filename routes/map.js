var express = require('express');
var router = express.Router();

var map_controller = require('../controllers/mapController');

router.get('/', map_controller.index);
// router.get('/map/populateDb', map_controller.populateDb);
router.get('/map/countries', map_controller.getCountries);

module.exports = router;
