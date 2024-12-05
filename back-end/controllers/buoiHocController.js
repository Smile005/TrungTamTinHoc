const pool = require('../config/db');
const { format } = require('date-fns');
const moment = require('moment');


// Lấy danh sách buổi học theo tháng và năm
const getBuoiHocByThang = async (req, res) => {
    const { month, year } = req.query;
    try {
        const [rows] = await pool.query(`
             SELECT 
                bh.maLichHoc, 
                lh.maMonHoc,
                mh.tenMonHoc, 
                bh.maLopHoc, 
                lh.tenLopHoc,
                bh.maGiaoVien, 
                nv.tenNhanVien AS tenGiaoVien,
                bh.maCa, 
                bh.maPhong, 
                bh.ngayHoc, 
                bh.loai,
                bh.trangThai, 
                bh.ghiChu
            FROM BuoiHoc bh
            LEFT JOIN LopHoc lh ON bh.maLopHoc = lh.maLopHoc
            LEFT JOIN MonHoc mh ON lh.maMonHoc = mh.maMonHoc
            LEFT JOIN NhanVien nv ON bh.maGiaoVien = nv.maNhanVien
            WHERE YEAR(bh.ngayHoc) = ?
        `, [year]);

        //     WHERE MONTH(bh.ngayHoc) = ? AND YEAR(bh.ngayHoc) = ?
        // `, [month, year]);

        // Định dạng lại trường 'ngayHoc'
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách buổi học theo mã lớp
const getBuoiHocByMaLop = async (req, res) => {
    const { maLopHoc } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT * FROM BuoiHoc WHERE maLopHoc = ?
        `, [maLopHoc]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách buổi học theo mã lịch học
const getBuoiHocByMaLichHoc = async (req, res) => {
    const { maLichHoc } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT * FROM BuoiHoc WHERE maLichHoc = ?
        `, [maLichHoc]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBuoiHoc = async (req, res) => {
    const { maLopHoc, maNhanVien, maCa, maPhong, ngayHoc, ghiChu } = req.body;

    // Xác thực cơ bản
    if (!maLopHoc || !maNhanVien || !maCa || !maPhong || !ngayHoc) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
    }

    const loai = 'Ngày học';
    const trangThai = 'Đã lên lịch';
    try {
        await pool.query(`
            INSERT INTO BuoiHoc (maLopHoc, maGiaoVien, maCa, maPhong, ngayHoc, trangThai, ghiChu, loai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            maLopHoc,
            maNhanVien,
            maCa,
            maPhong,
            moment(ngayHoc).format('YYYY-MM-DD'), // Đảm bảo ngày được định dạng chính xác
            trangThai,
            ghiChu || null,
            loai
        ]);
        res.status(201).json({ message: "Buổi học đã được tạo thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLichThi = async (req, res) => {
    const { maLopHoc, maNhanVien, maCa, maPhong, ngayHoc, ghiChu } = req.body;

    // Xác thực cơ bản
    if (!maLopHoc || !maNhanVien || !maCa || !maPhong || !ngayHoc) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
    }

    const loai = 'Ngày thi';
    const trangThai = 'Đã lên lịch';
    try {
        await pool.query(`
            INSERT INTO BuoiHoc (maLopHoc, maGiaoVien, maCa, maPhong, ngayHoc, trangThai, ghiChu, loai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            maLopHoc,
            maNhanVien,
            maCa,
            maPhong,
            moment(ngayHoc).format('YYYY-MM-DD'), // Đảm bảo ngày được định dạng chính xác
            trangThai,
            ghiChu || null,
            loai
        ]);
        res.status(201).json({ message: "Buổi học đã được tạo thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin buổi học
const updateBuoiHoc = async (req, res) => {
    const { maLopHoc, ngayHoc, maCa } = req.params;
    const { maGiaoVien, maPhong, ghiChu } = req.body; // loại không được sử dụng
    try {
        await pool.query(`
            UPDATE BuoiHoc 
            SET maGiaoVien = ?, maPhong = ?, ghiChu = ?
            WHERE maLopHoc = ? AND ngayHoc = ? AND maCa = ?
        `, [maGiaoVien, maPhong, ghiChu, maLopHoc, ngayHoc, maCa]); // Đảm bảo đúng thứ tự tham số
        res.status(200).json({ message: "Buổi học đã được cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa buổi học (chuyển trạng thái sang 'Đã hủy')
const deleteBuoiHoc = async (req, res) => {
    const { maLopHoc, ngayHoc, maCa } = req.params;
    try {
        await pool.query(`
            UPDATE BuoiHoc SET trangThai = 'Đã hủy' 
            WHERE maLopHoc = ? AND ngayHoc = ? AND maCa = ?
        `, [maLopHoc, ngayHoc, maCa]);
        res.status(200).json({ message: "Buổi học đã được hủy" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBuoiHocByThang,
    getBuoiHocByMaLop,
    getBuoiHocByMaLichHoc,
    createBuoiHoc,
    updateBuoiHoc,
    deleteBuoiHoc,
    createLichThi
};
