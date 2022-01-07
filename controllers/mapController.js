const traceroute = require('traceroute');
const geoip = require('geoip-lite');
const dataJson = require('../mapdata.json');
const Country = require('../models/country');
const Polygon = require('../models/polygon');
const MultiPolygon = require('../models/multipolygon');
const async = require('async');

exports.index = (req, res, next) => {
  console.log('/map');

  const returnData = [];

  // req.socket.remoteAddress
  traceroute.trace(req.socket.remoteAddress, function (err, hops) {
    console.log(hops);

    if (!err) {
      // console.log('start');
      hops.forEach((hop) => {
        for (const [key, value] of Object.entries(hop)) {
          // console.log(`${key} : ${value}`);

          const geo = geoip.lookup(key);
          if (geo != null) {
            const dataObj = generateObjectFromGeoData(geo, value);
            console.log(typeof dataObj);
            if (dataObj != null) {
              console.log('push');
              returnData.push(dataObj);
            }
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

exports.populateDb = (req, res, next) => {
  dataJson.features.forEach((f) => {
    let geo = null;
    if (f.geometry.type === 'Polygon') {
      geo = new Polygon({
        type: 'Polygon',
        coordinates: f.geometry.coordinates,
      });
    } else if (f.geometry.type === 'MultiPolygon') {
      geo = new MultiPolygon({
        type: 'MultiPolygon',
        coordinates: f.geometry.coordinates,
      });
    }

    if (geo != null) {
      async.waterfall(
        [
          function (callback) {
            // console.log('waterfall 1');
            geo.save((err, doc) => {
              if (err) {
                console.log('Error ' + err);
              }

              // console.log('Doc ' + doc);
              callback(null, doc);
            });
          },
          function (arg1, callback) {
            // console.log('waterfall 2');
            // console.log(arg1);

            const country = new Country({
              name: f.properties.sovereignt,
              iso_a2: f.properties.iso_a2,
              geometry: arg1._id,
            });

            country.save((err) => {
              if (err) {
                console.log('Error ' + err);
              }

              callback(null, 'done');
            });
          },
        ],
        function (err, results) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
  res.end();
};
