const express = require('express');
const { getCaHoc, createCaHoc, updateCaHoc } = require('../controllers/caHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(2), getCaHoc);
router.post('/them-cahoc', authMiddleware(2), createCaHoc);
router.post('/sua-cahoc', authMiddleware(2), updateCaHoc);

module.exports = router;
