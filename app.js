const express = require('express');
const adminRoutes = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error')
const path = require('path')

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

app.listen(3000);