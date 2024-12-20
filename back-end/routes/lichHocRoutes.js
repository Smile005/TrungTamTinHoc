const express = require('express');
const {
    getBuoiHocByThang,
    getBuoiHocByMaLop,
    getBuoiHocByMaLichHoc,
    createBuoiHoc,
    updateBuoiHoc,
    deleteBuoiHoc,
    createLichThi
} = require('../controllers/buoiHocController');

const { getLichHocByMaLop, createLichHoc, deleteLichHoc, updateLichHoc, kiemTraLichHoc } = require('../controllers/lichHocController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Lịch học
router.get('/getLichHocByMaLop/:maLopHoc', authMiddleware(2), getLichHocByMaLop); // Lấy lịch học theo mã lớp
router.post('/createLichHoc', authMiddleware(2), createLichHoc); // Tạo lịch học
router.delete('/deleteLichHoc/:maLichHoc', authMiddleware(2), deleteLichHoc); // Xóa lịch học
router.put('/updateLichHoc/:maLichHoc', authMiddleware(2), updateLichHoc); // Cập nhật lịch học
router.get('/kiem-tra-lich-hoc', authMiddleware(2), kiemTraLichHoc)

// Buổi học
router.get('/getBuoiHocByThang', authMiddleware(2), getBuoiHocByThang); // Lấy danh sách buổi học theo tháng
router.get('/getBuoiHocByMaLop/:maLopHoc', authMiddleware(2), getBuoiHocByMaLop); // Lấy danh sách buổi học theo mã lớp
router.get('/getBuoiHocByMaLichHoc/:maLichHoc', authMiddleware(2), getBuoiHocByMaLichHoc); // Lấy danh sách buổi học theo mã lịch học
router.post('/createBuoiHoc', authMiddleware(2), createBuoiHoc); // Tạo buổi học
router.post('/createLichThi', authMiddleware(2), createLichThi); // Tạo buổi học
router.put('/updateBuoiHoc/:maLopHoc/:ngayHoc/:maCa', authMiddleware(2), updateBuoiHoc); // Cập nhật thông tin buổi học
router.delete('/deleteBuoiHoc/:maLopHoc/:ngayHoc/:maCa', authMiddleware(2), deleteBuoiHoc); // Xóa buổi học

module.exports = router;
