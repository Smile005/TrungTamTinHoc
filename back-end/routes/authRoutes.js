const express = require('express');
const { register, login} = require('../controllers/authController');
const { changePassword, changeRole, getTaiKhoan, changeStatus, khoaTaiKhoan, moKhoaTaiKhoan } = require('../controllers/taiKhoanController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/ds-taikhoan', authMiddleware(1), getTaiKhoan);
router.post('/change-password', authMiddleware(1), changePassword);
router.post('/change-role', authMiddleware(1), changeRole);
router.post('/update-trangthai', authMiddleware(1), changeStatus);
router.post('/khoa-taiKhoan', authMiddleware(1), khoaTaiKhoan);
router.post('/moKhoa-taiKhoan', authMiddleware(1), moKhoaTaiKhoan);

module.exports = router;
