require('dotenv').config();
const path = require('path');
const express = require('express');
// order of imports does not matterb
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');


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
app.use((req, res, next) => {
    User.findById("643359cbb3bfb460f2f91522")
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => console.log(err));
});

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(authRoutes);



// 404 page catch all
app.use(errorController.get404);

mongoose.connect(`mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/shop?retryWrites=true&w=majority`)
    .then((result) => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Wesley',
                    email: 'wesley@test.com',
                    cart: {
                        items: []
                    }
                });
            };
            user.save();
        });
        app.listen(3000);
    })
    .catch(err => console.log(err));