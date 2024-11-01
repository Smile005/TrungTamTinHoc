const express = require('express');
const { getHocVien, createHocVien, updateHocVien, xoaHocVien, exportHocVienToExcel  } = require('../controllers/hocVienController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-hocvien', authMiddleware(2), getHocVien); 
router.post('/them-hocvien', authMiddleware(2), createHocVien);
router.post('/sua-hocvien', authMiddleware(2), updateHocVien);
router.post('/xoa-hocvien', authMiddleware(2), xoaHocVien);
router.get('/xuat-hocvien', authMiddleware(2), exportHocVienToExcel);

module.exports = router;