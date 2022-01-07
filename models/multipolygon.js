var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const MultiPolygonSchema = new Schema({
  type: {
    type: String,
    enum: ['MultiPolygon'],
    required: true,
  },
  coordinates: {
    type: [[[[Number]]]], // Array of arrays of arrays of numbers
    required: true,
  },
});

module.exports = mongoose.model('MultiPolygon', MultiPolygonSchema);
