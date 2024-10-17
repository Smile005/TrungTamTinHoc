const express = require('express');
const { register, login} = require('../controllers/authController');
const { changePassword, changeRole, getTaiKhoan, khoaTaiKhoan, moKhoaTaiKhoan } = require('../controllers/taiKhoanController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/ds-taikhoan', authMiddleware(2), getTaiKhoan);
router.post('/change-password', authMiddleware(2), changePassword);
router.post('/change-role', authMiddleware(2), changeRole);
router.post('/khoa-taiKhoan', authMiddleware(2), khoaTaiKhoan);
router.post('/moKhoa-taiKhoan', authMiddleware(1), moKhoaTaiKhoan);

module.exports = router;
