require('dotenv').config();
const path = require('path');
const express = require('express');
// order of imports does not matterb
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
// const User = require('./models/user');

const MongoDBPassword = process.env.DB_PASSWORD;


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
// app.use((req, res, next) => {
//     User.findById("642f1f544bfefe6b28dcf52d")
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoute);

// 404 page catch all
app.use(errorController.get404);

mongoose.connect(`mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/shop?retryWrites=true&w=majority`)
.then((result) => {
    app.listen(3000);
})
.catch(err => console.log(err));