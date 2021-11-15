let mongoose = require('mongoose');
const mensajesCollection = 'mensajes';

const MensajesSchema = mongoose.Schema({
    email: {type: String, require: true},
    text: {type: String, require: true}
});

module.exports = {
    Mensaje: mongoose.model(mensajesCollection, MensajesSchema)
}