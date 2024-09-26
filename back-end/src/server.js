const express = require('express');
const nhanVienRoutes = require('./routes/nhanVienRoutes'); // Đường dẫn tới file routes
const db = require('./config/db'); // Kết nối cơ sở dữ liệu

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Đưa db vào request để sử dụng trong routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Sử dụng các route
app.use('/api', nhanVienRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
