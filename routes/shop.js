const express = require('express');
const path = require('path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;