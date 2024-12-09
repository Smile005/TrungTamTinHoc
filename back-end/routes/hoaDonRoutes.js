const express = require('express');
const { getHoaDon, createHoaDon, getHoaDonByMa, exportHoaDonPDF } = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-hoadon', authMiddleware(2), getHoaDon);
router.get('/hoaDonByMa/maHoaDon=:maHoaDon', authMiddleware(2), getHoaDonByMa);
router.post('/them-hoadon', authMiddleware(2), createHoaDon);
router.get('/hoaDonPDF/:maHoaDon', exportHoaDonPDF);

module.exports = router;
