const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animitiesSchema = new Schema({
cooling:{type: Boolean},
heating:{type: Boolean},
iron:{type: Boolean},
office:{type: Boolean},
washing_machine:{type: Boolean},
dishwasher:{type: Boolean},
});

module.exports = mongoose.model('Animity', animitiesSchema);
