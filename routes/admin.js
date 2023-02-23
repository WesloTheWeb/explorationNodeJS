const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-products => GET
router.get('/add-product', adminController.getAddProducts);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-products => POST
router.post('/add-products', adminController.postAddProduct);

module.exports = router;