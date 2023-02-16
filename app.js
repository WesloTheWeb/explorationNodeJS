const express = require('express');
const adminRoute = require('./routes/admin'); // order of imports does not matter
const shopRoute = require('./routes/shop');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// order matters on middleware
app.use(adminRoute);
app.use(shopRoute);



app.listen(3000);
