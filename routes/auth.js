const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
    [check('email').
        isEmail()
        .withMessage('Please enter a valid email.')
        .custom((val, { req }) => {
            if (value === 'test@test.com') {
                throw new Error('Real funny -__-. Use a real email address')
            };
            return true;
        }),
    check(),
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
