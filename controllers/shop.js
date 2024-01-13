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

  Order.findById(orderId)
    .then((order) => {
      //   if (!order) {
      //     return next(new Error('No order found.'));
      //   };

      //   if (order.user.userId.toString() !== req.user._id.toString()) {
      //     return next(new Error('Unauthorized'));
      //   };

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res); // writes to client

      // pdf styling
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;

      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(`
            ${prod.product.title} - ${prod.quantity} x $${prod.product.price}
          `)
      });
      pdfDoc.text("-----------------------");
      pdfDoc
        .fontSize(20)
        .text(`Total Price: $${totalPrice}`);
      pdfDoc.end();
    })
    .catch((err) => next(err));
};

/* Note:
The reason we are able to call req.user
.<FUNCTION> is because in our app.js,
we set our req.user
 = user, which is our User class model because
findById returns 


req.user
 is being used as an instance of the User model which has been obtained from the database using the findById method. 
The User model is defined in the ./models/user.js file.

When the findById method returns a user object, it is attached to the req object by assigning it to the req.user
 property. 
This is done using the middleware function:

app.use((req, res, next) => {
    User.findById("643359cbb3bfb460f2f91522")
        .then(user => {
            req.user
 = user
            next();
        })
        .catch(err => console.log(err));
});

After attaching the user object to req.user
, it can be used in subsequent middleware functions and route handlers.

In the postOrder function, req.user
.populate('cart.items.productId') is used to load the productId 
of each item in the cart. Then, req.user
 is used to get the name and userId of the user who is placing the order. 
Finally, req.user
.clearCart() is called to clear the cart of the user after the order has been placed.

In the getOrders function, req.user
.getOrders() is used to get the orders placed by the user. 
Here, getOrders() is assumed to be a custom method defined on the User model, which retrieves the orders 
related to the user.
*/