const pool = require('../config/db');

const getCaHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM CaHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createCaHoc = async (req, res) => {
  const { maCa, batDau, ketThuc, trangThai, ghiChu } = req.body;

  if (!maCa) {
    return res.status(400).json({ message: 'Mã ca học là bắt buộc.' });
  }

  try {
    const [existingCaHoc] = await pool.query('SELECT * FROM CaHoc WHERE maCa = ?', [maCa]);
    if (existingCaHoc.length > 0) {
      return res.status(400).json({ message: 'Ca học đã tồn tại.' });
    }

    await pool.query(
      'INSERT INTO CaHoc (maCa, batDau, ketThuc, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?)',
      [
        maCa,
        batDau || null,
        ketThuc || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null
      ]
    );

    res.status(201).json({ message: 'Thêm ca học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const updateCaHoc = async (req, res) => {
  const { maCa, batDau, ketThuc, trangThai, ghiChu } = req.body;

  if (!maCa || !batDau || !ketThuc) {
    return res.status(400).json({ message: 'Mã ca học,thời gian bắt đầu và kết thúc là bắt buộc.' });
  }

  try {
    const [existingCaHoc] = await pool.query('SELECT * FROM CaHoc WHERE maCa = ?', [maCa]);
    if (existingCaHoc.length === 0) {
      return res.status(404).json({ message: 'Ca học không tồn tại.' });
    }

    await pool.query(
      'UPDATE CaHoc SET batDau = ?, ketThuc = ?, trangThai = ?, ghiChu = ? WHERE maCa = ?',
      [
        batDau,
        ketThuc,
        trangThai || 'Đang hoạt động',
        ghiChu || null,
        maCa
      ]
    );

    res.status(200).json({ message: 'Cập nhật ca học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { getCaHoc, createCaHoc, updateCaHoc };
