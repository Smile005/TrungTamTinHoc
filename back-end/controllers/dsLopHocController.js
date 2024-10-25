const pool = require('../config/db');

const getDS_Lop = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM DsLopHoc');
        res.json(results);
      } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
      }
};

const getDS_Lop02 = async (req, res) => {
    const { maLopHoc } = req.body;

    try {
        const [results] = await pool.query(`
            SELECT 
                hv.maHocVien,
                hv.tenHocVien,
                dl.ghiChu
            FROM 
                DsLopHoc dl
            JOIN 
                HocVien hv ON dl.maHocVien = hv.maHocVien
            WHERE 
                dl.maLopHoc = ?
        `, [maLopHoc]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy học viên cho mã lớp học này' });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy danh sách học viên', error });
    }
};

const xepLop = async (req, res) => {
    
};

const chuyenLop = async (req, res) => {

};

const diemDanh = async (req, res) => {

};

const nhapDiem = async (req, res) => {

};

module.exports = { getDS_Lop, chuyenLop, xepLop, diemDanh, nhapDiem, getDS_Lop02 };