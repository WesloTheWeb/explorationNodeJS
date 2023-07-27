const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("643359cbb3bfb460f2f91522")
        .then(user => {
            req.session.isLoggedIn = true;
            // set the user here
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
    User.findById("643359cbb3bfb460f2f91522")
        .then(user => {
            req.session.isLoggedIn = true;
            // set the user here
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};