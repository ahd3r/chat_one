const mysql = require('mysql2');

const pool = mysql.createPool({
  password:'1111',
  user:'root',
  host:'localhost',
  database:'phone_book'
});

module.exports = pool.promise();
