const traceroute = require('traceroute');
const geoip = require('geoip-lite');

exports.index = (req, res, next) => {
  console.log('/map');

  const returnData = [];

  // req.socket.remoteAddress
  traceroute.trace('www.google.com', function (err, hops) {
    if (!err) {
      // console.log('start');
      hops.forEach((hop) => {
        for (const [key, value] of Object.entries(hop)) {
          // console.log(`${key} : ${value}`);

          const geo = geoip.lookup(key);
          // console.log(geo);
          const dataObj = generateObjectFromGeoData(geo, value);
          console.log(typeof dataObj);
          if (dataObj != null) {
            console.log('push');
            returnData.push(dataObj);
          }
        }

        //console.log(hop)
      });
      // console.log('end');

      console.log('length = ' + returnData.length);
      if (returnData.length > 0) {
        console.log(returnData);
        res.json(returnData);
      } else {
        let error = new Error('Error retrieving geo data');
        error.status = 404;
        return next(error);
      }
    } else {
      return next(err);
    }
  });
};

const generateObjectFromGeoData = (geoData, time) => {
  console.log(geoData);
  console.log(typeof geoData.country);
  if (geoData.country.length > 0) {
    const newObj = {
      country: geoData.country,
      city: geoData.city,
      ll: geoData.ll,
      time: time,
    };

    console.log('return obj');
    return newObj;
  }
  console.log('return null');
  return null;
};
