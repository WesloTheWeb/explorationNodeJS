require('dotenv').config();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MongoDBPassword = process.env.DB_PASSWORD

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://Wesley:${MongoDBPassword}@cluster0.k30d4tr.mongodb.net/?retryWrites=true&w=majority`)
        .then((client) => {
            console.log('Connection Successful!');
            callback(client);
        })
        .catch(err => console.log(err));
};

module.exports = mongoConnect;