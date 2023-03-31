require('dotenv').config();

const express = require('express');
const adminRoutes = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const path = require('path');
const Product = require('./models/product');
const User = require('./models/user');

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

Product.belongsTo(User, { constraints: true, onDelee: 'CASCADE' });
User.hasMany(Product);

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
    .then((result) => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Wes', email: 'deezenuts143@uwu.com' })
        }
    })
    .then(user => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
