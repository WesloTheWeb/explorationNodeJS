require('dotenv').config();

const express = require('express');
const adminRoutes = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const path = require('path');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-Item');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// order matters on middleware:
// parses form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows static CSS file to be used.
app.use(express.static(path.join(__dirname, 'public')));

// dummy data
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// ASSOCIATION - Sequelize:
Product.belongsTo(User, { constraints: true, onDelee: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

app.use('/admin', adminRoutes);
app.use(shopRoute);

// 404 page catch all
app.use(errorController.get404);


// old set up
// sequelize.sync({ force: true })
//     .then((result) => {
//         // console.log(result)
//         app.listen(3000);
//     })
//     .catch(err => console.log(err));

// Dummy User set up:
sequelize.sync()
    // sequelize.sync({ force: true })
    .then((result) => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Wes', email: 'deezenuts143@uwu.com' })
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
