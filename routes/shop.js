const express = require('express');
const productsControlller = require('../controllers/products');

const router = express.Router();

router.get('/', productsControlller.getProducts);

module.exports = router;