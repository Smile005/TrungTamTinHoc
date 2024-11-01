const express = require('express');
const { getMonHoc, createMonHoc, updateMonHoc, xoaMonHoc, getMonHocHD, exportMonHocToExcel  } = require('../controllers/monHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ds-monhoc', authMiddleware(2), getMonHoc); 
router.get('/ds-monhocHD', authMiddleware(2), getMonHocHD); 
router.post('/them-monhoc', authMiddleware(2), createMonHoc); 
router.put('/sua-monhoc', authMiddleware(2), updateMonHoc); 
router.post('/xoa-monhoc', authMiddleware(2), xoaMonHoc); 
router.get('/xuat-monhoc', authMiddleware(2), exportMonHocToExcel);

module.exports = router;
