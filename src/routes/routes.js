const router = express.Router();
const { getLogin, postLogin, getSignUp, postSignUp, getFailSignUp, getFailLogin, getLogout } = require('../controllers/controllers');

app.get('/login', getLogin);
app.get('/failLogin', getFailLogin)
app.get('/register', getSignUp);
app.get('/failsignup', getFailSignUp)
app.get('/logout', getLogout)
app.get('/info', (req,res) => {
    const argObj = {
        argumentos: process.argv,
        plataforma: process.platform,
        nodeVersion: process.version,
        usoMemoria: process.memoryUsage(),
        pathEjecutcion: process.execPath,
        processID: process.pid,
        carpetaCorriente: process.cwd(),
        nroCPUS: numCPUs
    }
    res.send(JSON.stringify(argObj));
});
app.get('/randoms', (req,res) => {
    const computo = fork('./calculoRandoms.js', [req.query.cant ? req.query.cant : '100000000']);
    computo.send('start');
    computo.on('message', obj => res.end(obj))
})

module.exports = {
    router
}