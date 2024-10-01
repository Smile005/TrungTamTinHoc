const express = require('express');
const { getPhongHoc, createPhongHoc } = require('../controllers/phongHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(1), getPhongHoc);
router.post('/', authMiddleware(1), createPhongHoc);

module.exports = router;
