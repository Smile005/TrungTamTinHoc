const express = require('express');
const { getHoaDon, createHoaDon, getHoaDonByMa, exportHoaDonPDF, tongDoanhThu } = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-hoadon', authMiddleware(2), getHoaDon);
router.get('/doanhthu', authMiddleware(2), tongDoanhThu);
router.get('/hoaDonByMa/maHoaDon=:maHoaDon', authMiddleware(2), getHoaDonByMa);
router.post('/them-hoadon', authMiddleware(2), createHoaDon);
router.get('/hoaDonPDF/:maHoaDon', exportHoaDonPDF);

module.exports = router;
