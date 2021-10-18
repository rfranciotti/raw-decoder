const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DescoderSchema = new Schema({
    id_origem: String,
    new_raw: String,
    type: String,
    channel: String,
    message_type: String,
    repeat: Number,
    mmsi: Number,
    status: Number,
    rate: Number,
    speed: Number,
    position: Number,
    lon: String,
    longitude: Number,
    lat: String,
    latitude: Number,
    course: Number,
    heading: Number,
    maneuer: Number,
    raim: Number,
    radio: Number,
    timestamp: Date
})

module.exports = mongoose.models.Decoder || mongoose.model('Decoder', DescoderSchema)