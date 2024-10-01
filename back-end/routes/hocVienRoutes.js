const express = require('express');
const { getHocVien, createHocVien, updateHocVien } = require('../controllers/hocVienController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(2), getHocVien); 
router.post('/them-hocvien', authMiddleware(2), createHocVien);
router.post('/sua-hocvien', authMiddleware(2), updateHocVien);

module.exports = router;
