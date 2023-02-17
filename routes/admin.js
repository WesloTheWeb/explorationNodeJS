const express = require('express');
const path = require('path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-products', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
});

// /admin/add-products => POST
router.post('/add-products', (req, res, next) => {
    products.push({ title: req.body.title })
    res.redirect('/');
});

exports.routes = router;
exports.products = products;