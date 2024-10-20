const pool = require('../config/db');

const getPhongHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM PhongHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaPhong = async (connection) => {
  try {
    const query = `SELECT COUNT(maPhong) AS soLuong FROM PhongHoc;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaPhong = `PH${(soLuong + 1).toString().padStart(3, '0')}`;
    return nextMaPhong;
  } catch (error) {
    throw new Error('Không thể tạo mã phòng học');
  }
};

const createPhongHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { soLuong, trangThai, ghiChu } = req.body;

  try {
    await connection.beginTransaction();

    const maPhong = await createMaPhong(connection);

    await pool.query(
      'INSERT INTO PhongHoc (maPhong, soLuong, trangThai, ghiChu) VALUES (?, ?, ?, ?)',
      [maPhong, soLuong, trangThai || 'Đang hoạt động', ghiChu]
    );

    await connection.commit();
    res.status(201).json({ message: 'Thêm phòng học thành công.', maPhong });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const updatePhongHoc = async (req, res) => {
  const { maPhong, soLuong, trangThai, ghiChu } = req.body;

  if (!maPhong) {
    return res.status(400).json({ message: 'Mã phòng học là bắt buộc.' });
  }

  try {
    const [existingPhongHoc] = await pool.query('SELECT * FROM PhongHoc WHERE maPhong = ?', [maPhong]);
    if (existingPhongHoc.length === 0) {
      return res.status(404).json({ message: 'Phòng học không tồn tại.' });
    }

    await pool.query(
      'UPDATE PhongHoc SET soLuong = ?, trangThai = ?, ghiChu = ? WHERE maPhong = ?',
      [
        soLuong || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null,
        maPhong
      ]
    );

    res.status(200).json({ message: 'Cập nhật phòng học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const xoaPhongHoc = async (req, res) => {
  const { maPhong } = req.body;

  try {
    const [phongHoc] = await pool.query('SELECT * FROM PhongHoc WHERE maPhong = ?', [maPhong]);
    if (phongHoc.length === 0) return res.status(400).json({ message: 'Phòng học không tồn tại.' });

    await pool.query('DELETE FROM PhongHoc WHERE maPhong = ?', [maPhong]);

    res.json({ message: `Phòng học ${maPhong} đã bị xóa` });
  } catch (error) {
    res.status(500).json({ message: 'Xóa phòng học không thành công', error });
  }
}

module.exports = { getPhongHoc, createPhongHoc, updatePhongHoc, xoaPhongHoc };
