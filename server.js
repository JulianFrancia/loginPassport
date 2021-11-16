const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const Productos = require('./productos');
const {User} = require('./userModel');
const bCrypt = require('bcrypt');
const moment = require('moment');
const { getLogin, postLogin, getSignUp, postSignUp, getFailSignUp, getFailLogin, getLogout } = require('./routes');
const mensajesModel = require('./models/mensaje-model');
let listaProductos = []
const productos = new Productos(listaProductos);
let mensajes = [];
const {normalize, schema} = require('normalizr');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 8443;

//Para convertir en HTTPS
const https = require('https');
const fs = require('fs'); 
const path = require('path'); 
const httpsOptions = {
    key: fs.readFileSync('./sslcert/cert.key'),
    cert: fs.readFileSync('./sslcert/cert.pem')
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret:'secret',
    cookie: {
        maxAge: 600000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const server = https.createServer(httpsOptions, app)
    .listen(PORT, () => {
        console.log('Server corriendo en ' + PORT)
    })

server.on('error', error => console.log(error));

function connectDB() {
    const URI = 'mongodb://localhost:27017/ecommerce';
    mongoose.connect(URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('DB conectada')
}

connectDB();

io.on('connection', (socket) => {
    productos.devolverLista().then(prods => {
        socket.emit('mostrarProductos', prods);
    })
    socket.emit('mostrarMensajes', mensajes)
    socket.on('guardarProducto', data => {
        productos.guardarUnProducto(data);
        productos.devolverLista().then(prods => {
            io.sockets.emit('mostrarProductos', prods)
        });
    });
    socket.on('enviar', data => {
        data['fecha'] = moment().format('DD/MM/YYYY, h:mm:ss a');
        mensajes.push(data);
        const mensajeNuevo = {email: data.mail, text: data.text};
        const mensajeSchema = new schema.Entity('mensaje');
        const normalizeMensaje = normalize(mensajeNuevo,mensajeSchema);
        const mensajeSaveModel = new mensajesModel.Mensaje(normalizeMensaje);
        mensajeSaveModel.save();
        io.sockets.emit('mostrarMensajes', mensajes);
    });
    socket.on('login', data => {
        console.log(data)
    })
})

passport.use(new FacebookStrategy({
    clientID: '4465156603594863',
    clientSecret: 'cffae0dcac4717ee6b8902e45a00c164',
    callbackURL: `https://localhost:${PORT}/auth/facebook/login`,
    profileFields: ['id', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'username': profile.displayName}, async (err, user) => {
        if(err) {
            console.log(err)
            return done(err)
        }
        if(user) {
            return done(null, user)
        } else {
            const userSaveModel = new User({username: profile.displayName, password: createHash(accessToken)});
            await userSaveModel.save();
            return done(null,profile.displayName);
        }
    })
  }));

createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

validPassword = (password, encriptedPass) => {
    return bCrypt.compareSync(password, encriptedPass)
}

passport.serializeUser((user, done) => {
    User.findOne({'username': user.username},(err,userFound) => {
        done(null, userFound._id);
    })
    
});

passport.deserializeUser((id, done)=>{
    User.findOne({'_id': id},(err,user) => {
        done(null, user);
    })
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/login',
    passport.authenticate('facebook', { failureRedirect: '/error-login.html' }),
    function(req, res) {
        res.redirect('/login');
    }
);

app.get('/login', getLogin);
app.post('/login',passport.authenticate('login', {failureRedirect: '/failLogin'}), postLogin);
app.get('/failLogin', getFailLogin)
app.get('/register', getSignUp);
app.post('/register', passport.authenticate('signup', {failureRedirect: '/failsignup'}), postSignUp);
app.get('/failsignup', getFailSignUp)
app.get('/logout', getLogout)
