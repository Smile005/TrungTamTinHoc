const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVienController');

// Các routes
router.get('/nhanvien', nhanVienController.getNhanVien);
router.post('/nhanvien', nhanVienController.addNhanVien);
router.put('/nhanvien/:maNhanVien', nhanVienController.updateNhanVien);
router.delete('/nhanvien/:maNhanVien', nhanVienController.deleteNhanVien);
router.get('/nhanvien/:maNhanVien', nhanVienController.findNhanVienById);

module.exports = router;
