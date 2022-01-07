var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: String,
  iso_a2: String,
  geometry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Polygon',
  },
});

module.exports = mongoose.model('Country', CountrySchema);
