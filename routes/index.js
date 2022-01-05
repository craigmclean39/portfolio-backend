var express = require('express');
var router = express.Router();
const traceroute = require('traceroute');
const geoip = require('geoip-lite');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('TEST');

  // req.socket.remoteAddress
  traceroute.trace('www.github.com', function (err, hops) {
    if (!err) {
      console.log('start');
      hops.forEach((hop) => {
        for (const [key, value] of Object.entries(hop)) {
          console.log(`${key} : ${value}`);

          const geo = geoip.lookup(key);
          console.log(geo);
        }

        //console.log(hop)
      });
      console.log('end');
    } else {
      console.log(err);
    }
  });

  res.end();
});

module.exports = router;
