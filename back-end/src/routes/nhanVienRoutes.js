const express = require('express');
const nhanVienController = require('../controllers/nhanVienController');

const router = express.Router();

// Lấy tất cả nhân viên
router.get('/nhan-vien', nhanVienController.getNhanVien);

// Thêm nhân viên
router.post('/nhan-vien', nhanVienController.addNhanVien);

// Cập nhật nhân viên
router.put('/nhan-vien/:maNhanVien', nhanVienController.updateNhanVien);

// Xóa nhân viên
router.delete('/nhan-vien/:maNhanVien', nhanVienController.deleteNhanVien);

module.exports = router;
