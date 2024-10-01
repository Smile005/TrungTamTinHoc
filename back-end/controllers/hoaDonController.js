const pool = require('../config/db');

const getHoaDon = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM HoaDon');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createHoaDon = async (req, res) => {
  const { maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon, trangThai, ghiChu } = req.body;
  try {
    await pool.query(
      'INSERT INTO HoaDon (maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?)',
      [maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon, trangThai || 'Đang hoạt động', ghiChu]
    );
    res.status(201).json({ message: 'Tạo hóa đơn thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getHoaDon, createHoaDon };
