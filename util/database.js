const mysql = require('mysql2');
const Sequalize = require('sequelize');

const sequelize = new Sequalize('node_complete', 'root', 'dk338142', {
    dialect: 'mysql', 
    host:'localhost'
});

/* const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_complete',
    password: 'dk338142'

}); */

module.exports = sequelize;