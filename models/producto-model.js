let mongoose = require('mongoose');
const productosCollection = 'productos';

const ProductosSchema = mongoose.Schema({
    thumbnail: {type: String, require: true, minLength: 3, maxLenghth: 20},
    title: {type: String, require: true, minLength: 3, maxLenghth: 25},
    price: {type: Number, require: true}
});

module.exports = {
    Producto: mongoose.model(productosCollection, ProductosSchema)
}