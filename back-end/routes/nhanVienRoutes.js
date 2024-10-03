const express = require('express');
const { getNhanVien, createNhanVien, updateNhanVien, updateProfile } = require('../controllers/nhanVienController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-nhanvien', authMiddleware(1), getNhanVien);
router.post('/them-nhanvien', authMiddleware(1), createNhanVien);
router.post('/sua-nhanvien', authMiddleware(1), updateNhanVien);
router.post('/thong-tin-ca-nhan', authMiddleware(3), updateProfile);

module.exports = router;
