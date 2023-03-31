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

// parses form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows static CSS file to be used.
app.use(express.static(path.join(__dirname, 'public')));

// order matters on middleware
app.use('/admin', adminRoutes);
app.use(shopRoute);

// 404 page catch all
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelee: 'CASCADE' });
User.hasMany(Product);

sequelize.sync({ force: true })
    .then((result) => {
        // console.log(result)
        app.listen(3000);
    })
    .catch(err => console.log(err));
