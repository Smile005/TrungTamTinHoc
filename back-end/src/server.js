const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); 
const { authenticateToken } = require('./middlewares/authMiddleware'); 
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware để phân tích body của yêu cầu
app.use(bodyParser.json());

// Middleware để gán db vào req
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/auth', authRoutes); 
app.use('/nhanvien', authenticateToken, nhanVienRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
