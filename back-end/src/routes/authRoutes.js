// authRoutes.js
const express = require('express');
const { register, login, updateStatus, updateRole } = require('../controllers/authController');
const router = express.Router();

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Cập nhật trạng thái
router.put('/update-status', updateStatus);

// Cập nhật phân quyền
router.put('/update-role', updateRole);

module.exports = router;
