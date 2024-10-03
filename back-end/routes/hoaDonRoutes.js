const express = require('express');
const { getHoaDon, createHoaDon } = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-hoadon', authMiddleware(2), getHoaDon);
router.post('/them-hoadon', authMiddleware(2), createHoaDon);

module.exports = router;
