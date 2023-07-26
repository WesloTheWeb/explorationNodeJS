const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

// router.get('/login', (req, res, next) => {
//     const isLoggedIn = req
//       .get('Cookie')
//       .split(';')[1]
//       .trim()
//       .split('=')[1] === 'true';
// });

module.exports = router;