const productosModel = require('./models/producto-model');


class Productos {

    constructor(listaProductos) {
        this.listaProductos = listaProductos;
    }

    devolverLista() {
        return productosModel.Producto.find().then(prods => {
            if(prods.length == 0) {
                return {error: 'no hay productos cargados'}
            } else {
                return prods
            }
        })
    }

    devolveUnProducto(id) {
        return productosModel.Producto.find({_id: id}).then(prod => {
            if(prods.length == 0) {
                return {error: 'producto no encontrado'}
            } else {
                return prod
            }
        })
    }

    guardarUnProducto(producto) {
        const productoNuevo = {price: producto.price, thumbnail: producto.thumbnail , title:producto.title};
        const productoSaveModel = new productosModel.Producto(productoNuevo);
        productoSaveModel.save();
    }

    editarUnProducto(id,title, price, thumbnail) {
        productosModel.Producto.updateOne({_id:id} , {
            $set: {title: title,price : price,thumbnail: thumbnail}
        });
    }

    borrarUnProducto(id) {
        productosModel.Producto.deleteOne({_id:id});
    }
}

module.exports = Productos;