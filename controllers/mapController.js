const traceroute = require('traceroute');
const geoip = require('geoip-lite');
const dataJson = require('../mapdata.json');
const Country = require('../models/country');
const Polygon = require('../models/polygon');
const MultiPolygon = require('../models/multipolygon');
const async = require('async');

exports.index = (req, res, next) => {
  res.send('MAP TEST');
  res.end();
};

exports.getCountries = (req, res, next) => {
  console.log('GET.countries');
  console.dir(req.query);

  Country.find({ 'properties.iso_a2': { $in: req.query.countries } })
    .populate('geometry')
    .exec((err, results) => {
      if (err) {
        console.log(err);
      }

      console.log(results);

      const featureCollection = {
        type: 'FeatureCollection',
        features: results,
      };

      res.json(featureCollection);
    });
};

// This Populates the DB with Polygons, MultiPolygons, and Countries, loaded from
// a geoJson file
// This is an endpoint because it made it easy for me to test this function and run it easily from
// Postman, The route will be disabled in production build
exports.populateDb = (req, res, next) => {
  dataJson.features.forEach((f) => {
    let geo = null;
    let model = '';
    if (f.geometry.type === 'Polygon') {
      model = f.geometry.type;
      geo = new Polygon({
        type: 'Polygon',
        coordinates: f.geometry.coordinates,
      });
    } else if (f.geometry.type === 'MultiPolygon') {
      model = f.geometry.type;
      geo = new MultiPolygon({
        type: 'MultiPolygon',
        coordinates: f.geometry.coordinates,
      });
    }

    if (geo != null) {
      async.waterfall(
        [
          function (callback) {
            console.log('waterfall 1');
            geo.save((err, doc) => {
              if (err) {
                console.log('Error ' + err);
              }

              console.log('Doc ' + doc);
              callback(null, doc);
            });
          },
          function (arg1, callback) {
            console.log('waterfall 2');
            console.log(arg1);

            const country = new Country({
              type: 'Feature',
              properties: {
                name: f.properties.sovereignt,
                iso_a2: f.properties.iso_a2,
              },
              geometry: arg1._id,
              onModel: model,
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
