const express = require('express');
const {
    getNhanVien,
    createNhanVien,
    updateNhanVien,
    updateProfile,
    xoaNhanVien,
    exportNhanVienToExcel,
    getGiangVien
} = require('../controllers/nhanVienController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-nhanvien', authMiddleware(1), getNhanVien);
router.get('/ds-giangvien', authMiddleware(2), getGiangVien);
router.post('/them-nhanvien', authMiddleware(1), createNhanVien);
router.post('/sua-nhanvien', authMiddleware(1), updateNhanVien);
router.post('/thong-tin-ca-nhan', authMiddleware(3), updateProfile);
router.post('/xoa-nhanvien', authMiddleware(1), xoaNhanVien);
router.get('/export-nhanvien', authMiddleware(1), exportNhanVienToExcel);

module.exports = router;
