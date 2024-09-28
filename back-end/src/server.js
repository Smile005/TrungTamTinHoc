const express = require('express');
const cors = require('cors');
const loginRoutes = require('./routes/loginRoutes'); // Đường dẫn tới file routes
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8081;

// Sử dụng middleware cors để cho phép frontend truy cập vào backend
app.use(cors());

// Middleware xử lý JSON request body
app.use(express.json());

// Đưa db vào req để có thể sử dụng trong các routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Tích hợp route
app.use('/api', loginRoutes);
app.use('/api', nhanVienRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
