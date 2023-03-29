require('dotenv').config();

const Sequelize = require('sequelize');
const dbPassword = process.env.DB_PASSWORD

const sequelize = new Sequelize('node-complete', 'root', dbPassword, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;