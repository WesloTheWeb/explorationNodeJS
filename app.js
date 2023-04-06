require('dotenv').config();
const path = require('path');
const express = require('express');
// order of imports does not matter
const adminRoutes = require('./routes/admin'); 
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoute);

// 404 page catch all
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});