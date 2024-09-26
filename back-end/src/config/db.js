require('dotenv').config();
const mysql = require('mysql2');

// Tạo kết nối đến cơ sở dữ liệu
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Kết nối tới cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối tới cơ sở dữ liệu:', err);
        return;
    }
    console.log('Kết nối tới cơ sở dữ liệu thành công!');
});

module.exports = db; // Xuất đối tượng kết nối
