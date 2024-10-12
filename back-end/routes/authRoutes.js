const express = require('express');
const { register, login } = require('../controllers/authController');
const { changePassword, changeRole, getTaiKhoan, changeStatus } = require('../controllers/taiKhoanController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware(1), changePassword);
router.post('/change-role', authMiddleware(1), changeRole);
router.post('/update-trangthai', authMiddleware(1), changeStatus);
router.get('/ds-taikhoan', authMiddleware(1), getTaiKhoan);

module.exports = router;
