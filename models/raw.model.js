const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RawSchema = new Schema({
    idRaw: String,
    raw: String,
    receivedIn: Date,
    rawMessageIsDecoded: Boolean,
})

RawSchema.set('timestamps', true);

module.exports = mongoose.models.raw || mongoose.model('raw', RawSchema)