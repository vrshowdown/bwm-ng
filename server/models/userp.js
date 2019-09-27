const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userpSchema = new Schema({
    username: String,
    user: { type: Schema.Types.ObjectId, ref: 'User'}
});
module.exports = mongoose.model('UserP', userpSchema);