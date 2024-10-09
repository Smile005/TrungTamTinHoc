const pool = require('../config/db');

const getMonHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM MonHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaMH = async (connection) => {
  try {
    const query = `SELECT COUNT(maMonHoc) AS soLuong FROM MonHoc;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaMonHoc = `MH${(soLuong + 1).toString().padStart(3, '0')}`;
    return nextMaMonHoc;
  } catch (error) {
    throw new Error('Không thể tạo mã môn học');
  }
};

const createMonHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { tenMonHoc, soBuoiHoc, hocPhi, moTa, trangThai, ghiChu } = req.body;

  if (!tenMonHoc) {
    return res.status(400).json({ message: 'Tên môn học là bắt buộc.' });
  }

  try {
    await connection.beginTransaction();

    const maMonHoc = await createMaMH(connection);

    await pool.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    const [existingMonHoc] = await connection.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    if (existingMonHoc.length > 0) {
      return res.status(400).json({ message: 'Môn học đã tồn tại.' });
    }

    await connection.query(
      'INSERT INTO MonHoc (maMonHoc, tenMonHoc, soBuoiHoc, hocPhi, moTa, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        maMonHoc,
        tenMonHoc,
        soBuoiHoc || null,
        hocPhi || null,
        moTa || null,
        trangThai || "Đang Giảng Dạy",
        ghiChu || null
      ]
    );

    await connection.commit();
    res.status(201).json({ message: 'Thêm môn học thành công.', maMonHoc });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const updateMonHoc = async (req, res) => {
  const { maMonHoc, tenMonHoc, soBuoiHoc, hocPhi, moTa, trangThai, ghiChu } = req.body;

  if (!maMonHoc || !tenMonHoc) {
    return res.status(400).json({ message: 'Mã môn học và tên môn học là bắt buộc.' });
  }

  try {
    const [existingMonHoc] = await pool.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    if (existingMonHoc.length === 0) {
      return res.status(404).json({ message: 'Môn học không tồn tại.' });
    }

    await pool.query(
      'UPDATE MonHoc SET tenMonHoc = ?, soBuoiHoc = ?, hocPhi = ?, moTa = ?, trangThai = ?, ghiChu = ? WHERE maMonHoc = ?',
      [
        tenMonHoc,
        soBuoiHoc,
        hocPhi,
        moTa,
        trangThai,
        ghiChu,
        maMonHoc
      ]
    );

    res.status(200).json({ message: 'Cập nhật môn học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getMonHoc, createMonHoc, updateMonHoc };
