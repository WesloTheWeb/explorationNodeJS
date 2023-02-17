const express = require('express');
const adminRoute = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// order matters on middleware
app.use('/admin', adminRoute);
app.use(shopRoute);

// 404 page catch all
app.use((req, res, next) => {
    res.status(404).send(`<h1>Error 404: Page not Found.</h2>`);
});

app.listen(3000);