const pool = require('../config/db');

const getCaHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM CaHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaCa = async (connection) => {
  try {
    const query = `SELECT COUNT(maCa) AS soLuong FROM CaHoc;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaCa = `CA${(soLuong + 1).toString().padStart(5, '0')}`;
    return nextMaCa;
  } catch (error) {
    throw new Error('Không thể tạo mã ca học');
  }
};

const createCaHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { batDau, ketThuc, trangThai, ghiChu } = req.body;

  if (!batDau) {
    return res.status(400).json({ message: 'Thời gian bắt đầu là bắt buộc.' });
  }

  try {
    await connection.beginTransaction();
    
    const maCa = await createMaCa(connection);

    // Nếu không có thời gian kết thúc, đặt nó là 2 tiếng sau thời gian bắt đầu
    const ketThuc = req.body.ketThuc || new Date(new Date(batDau).getTime() + 2 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO CaHoc (maCa, batDau, ketThuc, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?)',
      [
        maCa,
        batDau,
        ketThuc,
        trangThai || 'Đang hoạt động',
        ghiChu || null
      ]
    );

    await connection.commit();
    res.status(201).json({ message: 'Thêm ca học thành công.', maCa });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const updateCaHoc = async (req, res) => {
  const { maCa, batDau, ketThuc, trangThai, ghiChu } = req.body;

  if (!maCa || !batDau) {
    return res.status(400).json({ message: 'Mã ca học và thời gian bắt đầu là bắt buộc.' });
  }

  try {
    const [existingCaHoc] = await pool.query('SELECT * FROM CaHoc WHERE maCa = ?', [maCa]);
    if (existingCaHoc.length === 0) {
      return res.status(404).json({ message: 'Ca học không tồn tại.' });
    }

    // Nếu không có thời gian kết thúc, đặt nó là 2 tiếng sau thời gian bắt đầu
    const ketThuc = req.body.ketThuc || new Date(new Date(batDau).getTime() + 2 * 60 * 60 * 1000);

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
