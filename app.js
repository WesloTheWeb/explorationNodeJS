const express = require('express');
const adminRoute = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');
const path = require('path')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows static CSS file to be used.
app.use(express.static(path.join(__dirname, 'public')));

// order matters on middleware
app.use('/admin', adminRoute);
app.use(shopRoute);

// 404 page catch all
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    // res.status(404).send(`<h1>Error 404: Page not Found.</h2>`);
});

app.listen(3000);