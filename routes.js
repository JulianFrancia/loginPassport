function getLogin(req,res) {
    if(req.isAuthenticated()) {
        const user = req.username;
        res.redirect('/productos.html')
    } else {
        res.redirect('/')
    }
}

function postLogin(req, res) {
    const user = req.username;
    res.redirect('/productos.html');
}

function getSignUp(req,res) {
    res.redirect('/register.html');
}

function postSignUp(req,res) {
    res.redirect('/productos.html');
}

function getFailSignUp(req,res) {
    res.redirect('/error-register.html')
}

function getFailLogin(req,res) {
    res.redirect('/error-login.html')
}

function getLogout(req,res) {
    req.logout();
    res.redirect('/')
}

module.exports = {
    getLogin,
    postLogin,
    getSignUp,
    postSignUp,
    getFailSignUp,
    getFailLogin,
    getLogout
}