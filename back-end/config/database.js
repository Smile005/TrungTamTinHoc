// database.js

const mysql = require('mysql2');

// Tạo kết nối với cơ sở dữ liệu
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_database'
});

// Kết nối đến MySQL
connection.connect((err) => {
  if (err) {
    console.error('Kết nối thất bại: ' + err.stack);
    return;
  }
  console.log('Kết nối thành công với ID ' + connection.threadId);
});

// Xuất đối tượng kết nối để sử dụng trong file khác
module.exports = connection;
