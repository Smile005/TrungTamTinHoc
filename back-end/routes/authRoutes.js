const express = require('express');
const { register, login, changePassword, changeRole, getTaiKhoan } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware(2), changePassword);
router.post('/change-role', authMiddleware(2), changeRole);
router.get('/ds-taikhoan', authMiddleware(2), getTaiKhoan);

module.exports = router;
