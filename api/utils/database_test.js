const mysql = require('mysql2');

const pool = mysql.createPool({
  password:'1111',
  user:'root',
  host:'localhost',
  database:'phone_book_test'
});

module.exports = pool.promise();
