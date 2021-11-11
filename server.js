const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const {User} = require('./userModel');
const bCrypt = require('bcrypt');
const { getLogin, postLogin, getSignUp, postSignUp, getFailSignUp, getFailLogin } = require('./routes');

const app = express();
const http = require('http').Server(app)
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret:'secret',
    cookie: {
        maxAge: 60000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const server = http.listen(PORT, () => {
    console.log(`server escuchando en ${PORT}`)
});

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

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
function(req, username, password, done) {
    User.findOne({'username': username}, (err, user) => {
        if(err) {
            console.log(err)
            return done(err)
        }
        if(user) {
            return done(null, false, console.log('ya existe el usuario'))
        } else {
            const userSaveModel = new User({username: username, password: createHash(password)});
            userSaveModel.save();
            return done({user: username})
        }
    })
}
));

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    },
    function(req, username, password, done) {
        User.findOne({'username': username}, (err, user) => {
            if(err) {
                console.log(err)
                return done(err)
            }
            if(validPassword(password, user.password)) {
                return done(username)
            } else {
                console.log('contrasenia erronea')
                return done(null, false, console.log('ya existe el usuario'))
            }
        })
    }
    ));

createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

validPassword = (password, encriptedPass) => {
    return bCrypt.compareSync(password, encriptedPass)
}

passport.serializeUser((user, done)=>{
    User.findOne({username: user},(err,user) => {
        done(null, user._id);
    })
    
});

passport.deserializeUser((id, done)=>{
    User.findOne({username: user},(err,user) => {
        done(null, user);
    })
});

app.get('/', getLogin);
app.post('/',passport.authenticate('login', {failureRedirect: '/failLogin'}), postLogin);
app.get('/failLogin', getFailLogin)
app.get('/register', getSignUp);
app.post('/register', passport.authenticate('signup', {failureRedirect: '/failsignup'}), postSignUp);
app.get('/failsignup', getFailSignUp)
