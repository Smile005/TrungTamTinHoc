const express = require('express');
const { getMonHoc, createMonHoc, updateMonHoc } = require('../controllers/monHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(2), getMonHoc); 
router.post('/them-monhoc', authMiddleware(2), createMonHoc); 
router.put('/sua-monhoc', authMiddleware(2), updateMonHoc); 

module.exports = router;
