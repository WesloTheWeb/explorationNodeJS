require('dotenv').config();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MongoDBPassword = process.env.DB_PASSWORD;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/shop?retryWrites=true&w=majority`)
        .then((client) => {
            console.log('Connection Successful!');
            _db = client.db();
            callback()
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    };
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;