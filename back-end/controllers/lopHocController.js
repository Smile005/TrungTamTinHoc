const pool = require('../config/db');

const getLopHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM LopHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaLop = async (connection) => {
  try {
    const query = `SELECT COUNT(maLop) AS soLuong FROM LopHoc;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaLop = `LOP${(soLuong + 1).toString().padStart(5, '0')}`;
    return nextMaLop;
  } catch (error) {
    throw new Error('Không thể tạo mã lớp học');
  }
};

const createLopHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { tenLop, maMonHoc, ngayBatDau, soLuong, ghiChu } = req.body;

  // Kiểm tra tính hợp lệ cho các trường bắt buộc
  if (!tenLop || !maMonHoc) {
    return res.status(400).json({ message: 'Tên lớp và mã môn học là bắt buộc.' });
  }

  try {
    await connection.beginTransaction();

    // Tạo mã lớp học mới
    const maLop = await createMaLop(connection);

    await pool.query(
      'INSERT INTO LopHoc (maLop, tenLop, maMonHoc, ngayBatDau, soLuong, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maLop, tenLop, maMonHoc, ngayBatDau, soLuong, 'Chưa mở đăng ký', ghiChu]
    );

    await connection.commit();
    res.status(201).json({ message: 'Thêm lớp học thành công.', maLop });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const updateLopHoc = async (req, res) => {
  const { maLop, tenLop, maMonHoc, ngayBatDau, soLuong, trangThai, ghiChu } = req.body;

  // Kiểm tra tính hợp lệ cho các trường bắt buộc
  if (!maLop || !tenLop || !maMonHoc) {
    return res.status(400).json({ message: 'Mã lớp, tên lớp và mã môn học là bắt buộc.' });
  }

  try {
    const [existingLopHoc] = await pool.query('SELECT * FROM LopHoc WHERE maLop = ?', [maLop]);
    if (existingLopHoc.length === 0) {
      return res.status(404).json({ message: 'Lớp học không tồn tại.' });
    }

    await pool.query(
      'UPDATE LopHoc SET tenLop = ?, maMonHoc = ?, ngayBatDau = ?, soLuong = ?, trangThai = ?, ghiChu = ? WHERE maLop = ?',
      [
        tenLop,
        maMonHoc,
        ngayBatDau || null,
        soLuong || null,
        trangThai || 'Có thể đăng ký',
        ghiChu || null,
        maLop
      ]
    );

    res.status(200).json({ message: 'Cập nhật lớp học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getLopHoc, createLopHoc, updateLopHoc };
