var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const CountrySchema = new Schema({
  type: { type: String, required: true, enum: ['Feature'] },
  properties: { name: { type: String }, iso_a2: { type: String } },

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
