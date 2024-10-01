const pool = require('../config/db');

const getPhongHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM PhongHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createPhongHoc = async (req, res) => {
  const { maPhong, soLuong, trangThai, ghiChu } = req.body;
  try {
    await pool.query(
      'INSERT INTO PhongHoc (maPhong, soLuong, trangThai, ghiChu) VALUES (?, ?, ?, ?)',
      [maPhong, soLuong, trangThai || 'Đang hoạt động', ghiChu]
    );
    res.status(201).json({ message: 'Thêm phòng học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getPhongHoc, createPhongHoc };
