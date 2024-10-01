const express = require('express');
const { register, login, changePassword, changeRole } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware(1), changePassword);
router.post('/change-role', authMiddleware(1), changeRole);

module.exports = router;
