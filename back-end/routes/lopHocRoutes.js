const express = require('express');
const { getLopHoc, createLopHoc } = require('../controllers/lopHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(1), getLopHoc);
router.post('/', authMiddleware(1), createLopHoc);

module.exports = router;
