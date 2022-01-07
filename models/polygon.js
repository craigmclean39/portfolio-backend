var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const PolygonSchema = new Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true,
  },
});

module.exports = mongoose.model('Polygon', PolygonSchema);
