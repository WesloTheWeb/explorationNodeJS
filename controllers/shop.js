const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  // take all cart item and move them into an order
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({
    "user.userId": req.user._id
  })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const SALES_TAX_RATE = 0.10; // Assuming a 10% sales tax rate.

  Order.findById(orderId)
    .then((order) => {
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      // Initialize a PDFDocument with some margin for styling
      const pdfDoc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res); // Send the PDF directly to the client.

      // Set up the header of the invoice
      pdfDoc
        .fontSize(26)
        .font('Helvetica-Bold')
        .text("Invoice", { align: 'center' })
        .moveDown();

      // Invoice number
      pdfDoc
        .fontSize(14)
        .text(`Order ID: #${orderId}`, { align: 'left' })
        .moveDown(0.5);

      // Add a horizontal line
      pdfDoc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 150)
        .lineTo(550, 150)
        .stroke()
        .moveDown(0.5);

      // List all products with their prices and quantities
      let y = 160; // Keep track of the y position for the following items
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(`${prod.product.title} x${prod.quantity} $${prod.product.price.toFixed(2)}`, 50, y);
        y += 20; // Increase the y position for the next product
      });

      // Add a horizontal line before the total
      pdfDoc
        .strokeColor("#aaaaaa")
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
        .moveDown(0.5);

      // Calculate and display the subtotal, sales tax, and total price
      const salesTax = totalPrice * SALES_TAX_RATE;
      const totalPriceWithTax = totalPrice + salesTax;

      pdfDoc
        .fontSize(16)
        .text(`Subtotal: $${totalPrice.toFixed(2)}`, 50, y + 20);
      pdfDoc
        .text(`Sales Tax (10%): $${salesTax.toFixed(2)}`, 50, y + 35);
      pdfDoc
        .fontSize(20)
        .text(`Total Price: $${totalPriceWithTax.toFixed(2)}`, 50, y + 50);

      // End the PDF document
      pdfDoc.end();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};