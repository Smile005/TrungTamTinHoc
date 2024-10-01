const pool = require('../config/db');

const getLopHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM LopHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createLopHoc = async (req, res) => {
  const { maLop, tenLop, maMonHoc, ngayBatDau, soLuong, trangThai, ghiChu } = req.body;
  try {
    await pool.query(
      'INSERT INTO LopHoc (maLop, tenLop, maMonHoc, ngayBatDau, soLuong, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maLop, tenLop, maMonHoc, ngayBatDau, soLuong, trangThai || 'Đang hoạt động', ghiChu]
    );
    res.status(201).json({ message: 'Thêm lớp học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getLopHoc, createLopHoc };
