var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: String,
  iso_a2: String,
  geometry: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Polygon', 'MultiPolygon'],
  },
});

module.exports = mongoose.model('Country', CountrySchema);
