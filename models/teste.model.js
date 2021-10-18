const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TesteSchema = new Schema({
    id_origem: String
})

module.exports = mongoose.models.Teste || mongoose.model('Teste', TesteSchema, "teste")