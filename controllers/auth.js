const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const User = require('../models/user');
require('dotenv').config();

// Email function using third party:
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PW
    }
});

if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PW) {
    throw new Error('MAILTRAP credentials are not set in the environment.');
}

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    };

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    };

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());

        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            isAuthenticated: false
        });
    };

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists.');
                return res.redirect('/signup');
            };

            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    // ? Creating a user
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });

                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup succeeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error)
        });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            };

            bcrypt.compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        console.log('Password matched successful.')
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err)
                            res.redirect('/');
                        });
                    };

                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    };

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
        isAuthenticated: false
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            return res.redirect('/reset');
        };

        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email was found. Please try again.');
                    return res.redirect('/reset');
                };

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                // send email to user with the token.
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'your-email@example.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                        <label>This is valid for 1 hour</label>
                    `
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            };

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                isAuthenticated: false,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    // ? We extract password and user from the request to our variables.
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err);
        });
};