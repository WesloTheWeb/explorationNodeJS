const express = require('express');
const productsControlller = require('../controllers/products');

const router = express.Router();

// /admin/add-products => GET
router.get('/add-products', productsControlller.getAddProducts);

// /admin/add-products => POST
router.post('/add-products', productsControlller.postAddProducts);

module.exports = router;