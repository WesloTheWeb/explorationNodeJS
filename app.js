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
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const MongoDBPassword = process.env.DB_PASSWORD;
const MONGODB_URI = `mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/shop`

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

// order matters on middleware:
// parses form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows static CSS file to be used.
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.isAuthenticated) {
        res.locals.isAuthenticated = false;
    }
    next();
});

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    };

    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            };

            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(authRoutes);

// 404 page catch all
app.use(errorController.get404);

// mongoose.connect(`mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/shop?retryWrites=true&w=majority`)
mongoose.connect(MONGODB_URI)
    .then((result) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));