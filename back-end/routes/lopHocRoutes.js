const express = require('express');
const { getLopHoc, createLopHoc, updateLopHoc, xoaLopHoc } = require('../controllers/lopHocController');
const { getDS_Lop, xepLop, diemDanh, nhapDiem, chuyenLop } = require('../controllers/dsLopHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-lophoc', authMiddleware(2), getLopHoc);
router.post('/them-lophoc', authMiddleware(2), createLopHoc);
router.post('/sua-lophoc', authMiddleware(2), updateLopHoc);
router.post('/xoa-lophoc', authMiddleware(2), xoaLopHoc);

router.get('/ds-hocvien', authMiddleware(2), getDS_Lop);
router.post('/xepLop', authMiddleware(2), xepLop);
router.post('/chuyenLop', authMiddleware(2), chuyenLop);
router.post('/diemDanh', authMiddleware(2), diemDanh);
router.post('/nhapDiem', authMiddleware(2), nhapDiem);

module.exports = router;
