const pool = require('../config/db');
const XLSX = require('xlsx');

const getCaHoc = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM CaHoc');
    
    // Format the batDau and ketThuc to exclude seconds
    const formattedResults = results.map(caHoc => {
      return {
        ...caHoc,
        batDau: caHoc.batDau.toString().slice(0, 5), // Get HH:MM
        ketThuc: caHoc.ketThuc.toString().slice(0, 5), // Get HH:MM
      };
    });

    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaCa = async (connection) => {
  try {
    const query = `SELECT maCa FROM CaHoc ORDER BY maCa DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaCa;

    if (result.length > 0) {
      const lastMaCa = result[0].maCa;
      const numericPart = parseInt(lastMaCa.slice(2));
      const newNumericPart = numericPart + 1;
      nextMaCa = `Ca${newNumericPart.toString().padStart(3, '0')}`;
    } else {
      nextMaCa = 'Ca001';
    }

    return nextMaCa;
  } catch (error) {
    throw new Error('Không thể tạo mã ca học');
  }
};

const createCaHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { batDau, ketThuc, trangThai, ghiChu } = req.body;

  // Kiểm tra xem thời gian bắt đầu có được cung cấp hay không
  if (!batDau) {
    return res.status(400).json({ message: 'Thời gian bắt đầu là bắt buộc.' });
  }

  try {
    await connection.beginTransaction();

    // Tạo mã ca học mới
    const maCa = await createMaCa(connection);

    // Chèn dữ liệu vào bảng CaHoc
    await connection.query(
      'INSERT INTO CaHoc (maCa, batDau, ketThuc, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?)',
      [
        maCa,
        batDau,
        ketThuc || new Date(new Date(`1970-01-01T${batDau}:00`).getTime() + 2 * 60 * 60 * 1000).toISOString().slice(11, 19),
        trangThai || 'Đang Hoạt Động',
        ghiChu || null
      ]
    );

    await connection.commit();
    res.status(201).json({ message: 'Thêm ca học thành công.', maCa });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error: error.message });
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

    await pool.query(
      'UPDATE CaHoc SET batDau = ?, ketThuc = ?, trangThai = ?, ghiChu = ? WHERE maCa = ?',
      [
        batDau,
        ketThuc || new Date(new Date(`1970-01-01T${batDau}:00`).getTime() + 2 * 60 * 60 * 1000).toISOString().slice(11, 19),
        trangThai || 'Đang Hoạt Động',
        ghiChu || null,
        maCa
      ]
    );

    res.status(200).json({ message: 'Cập nhật ca học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const xoaCaHoc = async (req, res) => {
  const { maCa } = req.body;

  try {
    const [caHoc] = await pool.query('SELECT * FROM CaHoc WHERE maCa = ?', [maCa]);
    if (caHoc.length === 0) return res.status(400).json({ message: 'Ca học không tồn tại.' });

    await pool.query('DELETE FROM CaHoc WHERE maCa = ?', [maCa]);

    res.json({ message: `Ca học ${maCa} đã bị xóa` });
  } catch (error) {
    res.status(500).json({ message: 'Xóa ca học không thành công', error });
  }
}
const exportCaHocXLSX = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM CaHoc');
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu ca học để xuất.' });
    }

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CaHoc');

    const filePath = './exports/CaHoc_List.xlsx';
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, 'CaHoc_List.xlsx', (err) => {
      if (err) {
        res.status(500).json({ message: 'Lỗi khi tải xuống file.', error: err.message });
      }

      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getCaHoc, createCaHoc, updateCaHoc, xoaCaHoc, exportCaHocXLSX };
