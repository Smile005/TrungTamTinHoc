const pool = require('../config/db');

const getMonHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM MonHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMonHoc = async (req, res) => {
  const { maMonHoc, tenMonHoc, soBuoiHoc, hocPhi, moTa, ghiChu } = req.body;

  if (!maMonHoc || !tenMonHoc) {
    return res.status(400).json({ message: 'Mã môn học và tên môn học là bắt buộc.' });
  }

  try {
    const [existingMonHoc] = await pool.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    if (existingMonHoc.length > 0) {
      return res.status(400).json({ message: 'Môn học đã tồn tại.' });
    }

    await pool.query(
      'INSERT INTO MonHoc (maMonHoc, tenMonHoc, soBuoiHoc, hocPhi, moTa, ghiChu) VALUES (?, ?, ?, ?, ?, ?)',
      [
        maMonHoc,
        tenMonHoc,
        soBuoiHoc || null, 
        hocPhi || null,
        moTa || null,
        ghiChu || null
      ]
    );

    res.status(201).json({ message: 'Thêm môn học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const updateMonHoc = async (req, res) => {
  const { maMonHoc, tenMonHoc, soBuoiHoc, hocPhi, moTa, ghiChu } = req.body;

  if (!tenMonHoc) {
    return res.status(400).json({ message: 'Tên môn học là bắt buộc.' });
  }

  try {
    const [existingMonHoc] = await pool.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    if (existingMonHoc.length === 0) {
      return res.status(404).json({ message: 'Môn học không tồn tại.' });
    }

    await pool.query(
      'UPDATE MonHoc SET tenMonHoc = ?, soBuoiHoc = ?, hocPhi = ?, moTa = ?, ghiChu = ? WHERE maMonHoc = ?',
      [
        tenMonHoc,
        soBuoiHoc || null, 
        hocPhi || null,
        moTa || null,
        ghiChu || null,
        maMonHoc
      ]
    );

    res.status(200).json({ message: 'Cập nhật môn học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getMonHoc, createMonHoc, updateMonHoc };
