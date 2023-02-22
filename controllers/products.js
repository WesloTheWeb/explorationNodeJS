// Since we are doing multiple exports.
const Product = require('../models/product')

exports.getAddProducts = (req, res, next) => {
    res.render('admin/add-products', {
        pageTitle: 'Add Products',
        path: '/admin/add-products',
        activeAddProduct: true
    });
};

exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        console.log(products);
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};