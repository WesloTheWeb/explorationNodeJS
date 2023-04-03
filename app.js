require('dotenv').config();

const express = require('express');
// order of imports does not matter
// #### TEMP COMMENT SINCE SQL IS REMOVED
// const adminRoutes = require('./routes/admin'); 
// const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const path = require('path');
const mongoConnect = require('./util/database');
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
});

// #### TEMP COMMENT SINCE SQL IS REMOVED
// app.use('/admin', adminRoutes);
// app.use(shopRoute);

// 404 page catch all
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});