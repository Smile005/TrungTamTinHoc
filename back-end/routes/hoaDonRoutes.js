const express = require('express');
const { getHoaDon, createHoaDon } = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(1), getHoaDon);
router.post('/', authMiddleware(1), createHoaDon);

module.exports = router;
