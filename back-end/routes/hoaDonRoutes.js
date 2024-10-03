const express = require('express');
const { getHoaDon, createHoaDon } = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(2), getHoaDon);
router.post('/', authMiddleware(2), createHoaDon);

module.exports = router;
