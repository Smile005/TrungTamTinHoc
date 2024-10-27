const express = require('express');
const { getLopHoc, createLopHoc, updateLopHoc, xoaLopHoc, getLopHocHD } = require('../controllers/lopHocController');
const { getDS_Lop, xepLop, diemDanh, nhapDiem, chuyenLop, getDS_Lop02, xoaXepLop, getDS_LopHV, getDS_maHV02 } = require('../controllers/dsLopHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-lophoc', authMiddleware(2), getLopHoc);
router.get('/ds-lophocHD', authMiddleware(2), getLopHocHD);
router.post('/them-lophoc', authMiddleware(2), createLopHoc);
router.post('/sua-lophoc', authMiddleware(2), updateLopHoc);
router.post('/xoa-lophoc', authMiddleware(2), xoaLopHoc);

router.get('/ds-hocvien', authMiddleware(2), getDS_Lop);
router.get('/ds-hocvien02', authMiddleware(2), getDS_Lop02);
router.get('/ds-theo-maHV/:maHocVien', authMiddleware(2), getDS_maHV02);
router.get('/dsLopCuaHV', authMiddleware(2), getDS_LopHV)
router.post('/xepLop', authMiddleware(2), xepLop);
router.delete('/xoaXepLop', authMiddleware(2), xoaXepLop);
router.post('/chuyenLop', authMiddleware(2), chuyenLop);
router.post('/diemDanh', authMiddleware(2), diemDanh);
router.post('/nhapDiem', authMiddleware(2), nhapDiem);

module.exports = router;
