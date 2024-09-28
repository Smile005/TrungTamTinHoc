require('dotenv').config();
const mysql = require('mysql2/promise'); // Sử dụng mysql2 với hỗ trợ Promise

// Tạo kết nối đến cơ sở dữ liệu với API Promise
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,  // Chờ nếu không có kết nối sẵn
    connectionLimit: 10,       // Giới hạn số kết nối tối đa
    queueLimit: 0              // Không giới hạn hàng đợi
});

// Kết nối tới cơ sở dữ liệu
async function testConnection() {
    try {
        const connection = await db.getConnection(); // Lấy một kết nối từ pool
        console.log('Kết nối tới cơ sở dữ liệu thành công!');
        connection.release(); // Giải phóng kết nối trả về pool
    } catch (err) {
        console.error('Lỗi kết nối tới cơ sở dữ liệu:', err);
    }
}

testConnection();

module.exports = db; // Xuất đối tượng kết nối để sử dụng trong các file khác
