const pool = require('../config/db');
const XLSX = require('xlsx');

const getMonHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM MonHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const getMonHocHD = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM MonHoc WHERE trangThai = ?', ['Đang Giảng Dạy']);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaMH = async (connection) => {
  try {
    const query = `SELECT maMonHoc FROM MonHoc ORDER BY maMonHoc DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaMonHoc;

    if (result.length > 0) {
      const lastMaMonHoc = result[0].maMonHoc.toUpperCase();
      const numericPart = parseInt(lastMaMonHoc.slice(2));
      const newNumericPart = numericPart + 1;
      nextMaMonHoc = `MH${newNumericPart.toString().padStart(4, '0')}`;
    } else {
      nextMaMonHoc = 'MH0001';
    }

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

    let maMonHoc = await createMaMH(connection);
    let maxAttempts = 3;
    let attempt = 0;
    let isUnique = false;

    while (attempt < maxAttempts && !isUnique) {
      const [existingMonHoc] = await connection.query(
        'SELECT * FROM MonHoc WHERE maMonHoc = ?',
        [maMonHoc]
      );

      if (existingMonHoc.length === 0) {
        isUnique = true;
      } else {
        maMonHoc++;
        attempt++;
      }
    }

    if (!isUnique) {
      return res.status(400).json({ message: `Không thể tạo môn học với mã ${maMonHoc}, hãy thử lại.` });
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
        soBuoiHoc || null,
        hocPhi || null,
        moTa || null,
        trangThai || "Đang Giảng Dạy",
        ghiChu || null,
        maMonHoc
      ]
    );

    res.status(200).json({ message: 'Cập nhật môn học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const xoaMonHoc = async (req, res) => {
  const { maMonHoc } = req.body;

  try {
    const [monHoc] = await pool.query('SELECT * FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);
    if (monHoc.length === 0) return res.status(400).json({ message: 'Không tìm thấy môn học' });

    await pool.query('DELETE FROM MonHoc WHERE maMonHoc = ?', [maMonHoc]);

    res.json({ message: `Môn học ${maMonHoc} đã bị xóa` });
  } catch (error) {
    res.status(500).json({ message: 'Xóa môn học không thành công', error });
  }
}

const exportMonHocToExcel = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        maMonHoc, 
        tenMonHoc, 
        soBuoiHoc, 
        hocPhi, 
        moTa, 
        trangThai, 
        ghiChu 
      FROM MonHoc
    `);

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách môn học');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="DanhSachMonHoc.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Xuất Excel không thành công', error });
  }
};

module.exports = { getMonHoc, createMonHoc, updateMonHoc, xoaMonHoc, getMonHocHD, exportMonHocToExcel };
