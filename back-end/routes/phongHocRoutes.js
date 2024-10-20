const express = require('express');
const { getPhongHoc, createPhongHoc, updatePhongHoc, xoaPhongHoc } = require('../controllers/phongHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-phong', authMiddleware(2), getPhongHoc);
router.post('/them-phong', authMiddleware(2), createPhongHoc);
router.post('/sua-phong', authMiddleware(2), updatePhongHoc);
router.post('/xoa-phong', authMiddleware(2), xoaPhongHoc)

module.exports = router;
