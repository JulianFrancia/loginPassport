const socket = io();

socket.on('mostrarProductos', (data) => {
    console.log(data)
    renderProducto(data)
});

socket.on('mostrarMensajes', data => {
    console.log(data)
    renderMensaje(data);
})

function enviarProducto() {
    const form = document.getElementById('form');
    const title = document.getElementById('title');
    const precio = document.getElementById('price');
    const img = document.getElementById('thumbnail');
    let producto = {
        title: title.value,
        price: precio.value,
        thumbnail: img.value
    }
    socket.emit('guardarProducto',producto);
    form.reset()
}

function renderProducto(data) {
    if(Array.isArray(data)){
        let html = 
    data.map(elem => {
return`
    <div style="display: grid; grid-template-rows: 40px 1fr; grid-template-colums: 1fr; grid-gap: 5px">
        <div style="display: flex;">
            <p style="width: 150px;">titulo</p>
            <p style="width: 70px;">precio</p>
            <p>imagen</p>
        </div>
        <div id="productos">
                    <div style="display: flex;">
                        <p style="width: 150px;">${elem.title}</p>
                        <p style="width: 70px;">${elem.price}</p>
                        <img style="width: 25px; heigth: 25px" src="${elem.thumbnail}" alt="">
                    </div>
        </div>
    </div>
        `
    }).join(' ')
    document.getElementById('productos').innerHTML = html;
    } else {
        document.getElementById('productos').innerHTML = "No hay productos cargados"
    }
}

function enviarMensaje() {
    let form = document.getElementById("formMensaje");;
    let mail = document.getElementById("mail");
    let mensaje = document.getElementById("mensaje");
    if(mail.value !== '') {
        let msg = {mail: mail.value, text: mensaje.value};
        socket.emit('enviar', msg)
    }
}
function renderMensaje(mensajes) {
    let mensajesContainer = document.getElementById("mensajes");
    let html = mensajes.map(e => {
        return `<strong><span style="color: blue">${e.mail} </span><span style="color: brown">[${e.fecha}] :</span></strong><span>${e.text}</span></br>`
    }).join(' ');
    mensajesContainer.innerHTML = html;
}