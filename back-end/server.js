const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const hocVienRoutes = require('./routes/hocVienRoutes');
const phongHocRoutes = require('./routes/phongHocRoutes');
const caHocRoutes = require('./routes/caHocRoutes');
const monHocRoutes = require('./routes/monHocRoutes');
const lopHocRoutes = require('./routes/lopHocRoutes');
const hoaDonRoutes = require('./routes/hoaDonRoutes');
const lichHocRoutes = require('./routes/lichHocRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: `http://localhost:${process.env.FE_PORT}`,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/hocvien', hocVienRoutes);
app.use('/api/phonghoc', phongHocRoutes);
app.use('/api/cahoc', caHocRoutes);
app.use('/api/monhoc', monHocRoutes);
app.use('/api/lophoc', lopHocRoutes);
app.use('/api/hoadon', hoaDonRoutes);
app.use('/api/lichhoc', lichHocRoutes);

app.listen(process.env.BE_PORT, () => {
  console.log(`Server running on port ${process.env.BE_PORT}`);
});
