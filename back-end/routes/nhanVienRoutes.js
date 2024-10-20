const express = require('express');
const { getNhanVien, createNhanVien, updateNhanVien, updateProfile, xoaNhanVien } = require('../controllers/nhanVienController');
const authMiddleware = require('../middlewares/authMiddleware');
const { khoaTaiKhoan } = require('../controllers/taiKhoanController');

const router = express.Router();

router.get('/ds-nhanvien', authMiddleware(1), getNhanVien);
router.post('/them-nhanvien', authMiddleware(1), createNhanVien);
router.post('/sua-nhanvien', authMiddleware(1), updateNhanVien);
router.post('/thong-tin-ca-nhan', authMiddleware(3), updateProfile);
router.post('/xoa-nhanvien', authMiddleware(1), khoaTaiKhoan, xoaNhanVien)

module.exports = router;
