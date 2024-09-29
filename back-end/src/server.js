const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/authRoutes'); 
const { authenticateToken } = require('./middlewares/authMiddleware'); 
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware để phân tích body của yêu cầu
app.use(bodyParser.json());

// Cấu hình CORS để cho phép các yêu cầu từ React frontend
app.use(cors({
  origin: 'http://localhost:3000', // Địa chỉ của ứng dụng React frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Middleware để gán db vào req
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Đường dẫn xác thực
app.use('/auth', authRoutes); 

// Đường dẫn dành cho nhân viên, được bảo vệ bằng middleware authenticateToken
app.use('/nhanvien', authenticateToken, nhanVienRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
