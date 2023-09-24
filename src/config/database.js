// Use for declare env variable
require("dotenv").config();
const mysql = require("mysql2/promise");

// Tạo kết nổi chịu tải cao bằng Pool. để giới hạn số lượng truy cập nhất định tránh việc làm sập database.
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = connection;