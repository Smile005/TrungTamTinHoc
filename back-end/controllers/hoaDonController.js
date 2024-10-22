const pool = require('../config/db');

const getHoaDon = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM HoaDon');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaHD = async (connection) => {
  try {
    const query = `SELECT maHoaDon FROM HoaDon ORDER BY maHoaDon DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaHoaDon;

    if (result.length > 0) {
      const lastMaHoaDon = result[0].maHoaDon;
      const numericPart = parseInt(lastMaHoaDon.slice(2));
      const newNumericPart = numericPart + 1;
      nextMaHoaDon = `HD${newNumericPart.toString().padStart(4, '0')}`;
    } else {
      nextMaHoaDon = 'HD0001';
    }

    return nextMaHoaDon;
  } catch (error) {
    throw new Error('Không thể tạo mã hóa đơn');
  }
};

const createHoaDon = async (req, res) => {
  const connection = await pool.getConnection();
  const { maNhanVien, maHocVien, ngayTaoHoaDon, trangThai, ghiChu } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!maNhanVien || !maHocVien || !ngayTaoHoaDon) {
    return res.status(400).json({ message: 'Mã nhân viên, mã học viên và ngày tạo hóa đơn là bắt buộc.' });
  }

  try {
    await connection.beginTransaction();

    // Tạo mã hóa đơn mới
    const maHoaDon = await createMaHD(connection);

    await pool.query(
      'INSERT INTO HoaDon (maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?)',
      [maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon || new Date(), trangThai || 'Đang hoạt động', ghiChu]
    );

    await connection.commit();
    res.status(201).json({ message: 'Tạo hóa đơn thành công.', maHoaDon });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

module.exports = { getHoaDon, createHoaDon };
