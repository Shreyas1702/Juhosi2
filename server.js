const mysql = require("mysql2");
require("dotenv").config();

var mysqlConnection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log("Error in database");
  } else {
    console.log("DB connected successfully");
  }
});

module.exports = mysqlConnection;
