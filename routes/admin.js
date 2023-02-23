const express = require('express');
const productsControlller = require('../controllers/products');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-products => GET
router.get('/add-product', productsControlller.getAddProducts);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-products => POST
router.post('/add-products', productsControlller.postAddProducts);

module.exports = router;