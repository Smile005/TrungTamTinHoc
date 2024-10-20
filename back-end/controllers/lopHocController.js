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
    const query = `SELECT COUNT(maLopHoc) AS soLuong FROM LopHoc;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaLop = `LOP${(soLuong + 1).toString().padStart(4, '0')}`;
    return nextMaLop;
  } catch (error) {
    throw new Error('Không thể tạo mã lớp học');
  }
};

// Thêm mới lớp học
const createLopHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { lopHocs } = req.body;

  if (!lopHocs || lopHocs.length === 0) {
    return res.status(400).json({ message: 'Không thể xác định dữ liệu lớp học.' });
  }

  try {
    await connection.beginTransaction();
    const addedLopHocs = [];

    for (let lopHoc of lopHocs) {
      const { tenLopHoc, maMonHoc, maNhanVien, ngayBatDau, soLuong, trangThai, ghiChu } = lopHoc;

      if (!tenLopHoc || !maMonHoc) {
        console.log('Lớp học bị bỏ qua do thiếu tên hoặc mã môn học:', lopHoc);
        continue;
      }

      const maLopHoc = await createMaLop(connection);

      await connection.query(
        'INSERT INTO LopHoc (maLopHoc, tenLopHoc, maMonHoc, maNhanVien, ngayBatDau, soLuong, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          maLopHoc,
          tenLopHoc,
          maMonHoc,
          maNhanVien,
          ngayBatDau || null,
          soLuong || null,
          trangThai || 'Chưa mở đăng ký',
          ghiChu || null
        ]
      );

      addedLopHocs.push(maLopHoc);
    }

    await connection.commit();

    res.status(201).json({
      message: `${addedLopHocs.length} lớp học đã được thêm thành công.`,
      ds_LopHoc: addedLopHocs
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Thêm lớp học không thành công', error });
  } finally {
    connection.release();
  }
};

// Cập nhật lớp học
const updateLopHoc = async (req, res) => {
  const { maLopHoc, tenLopHoc, maMonHoc, maNhanVien, ngayBatDau, soLuong, trangThai, ghiChu } = req.body;

  // Kiểm tra tính hợp lệ cho các trường bắt buộc
  if (!maLopHoc || !tenLopHoc || !maMonHoc) {
    return res.status(400).json({ message: 'Mã lớp, tên lớp và mã môn học là bắt buộc.' });
  }

  try {
    const [existingLopHoc] = await pool.query('SELECT * FROM LopHoc WHERE maLopHoc = ?', [maLopHoc]);
    if (existingLopHoc.length === 0) {
      return res.status(404).json({ message: 'Lớp học không tồn tại.' });
    }

    await pool.query(
      'UPDATE LopHoc SET tenLopHoc = ?, maMonHoc = ?, maNhanVien = ?, ngayBatDau = ?, soLuong = ?, trangThai = ?, ghiChu = ? WHERE maLopHoc = ?',
      [
        tenLopHoc,
        maMonHoc,
        maNhanVien,
        ngayBatDau || null,
        soLuong || null,
        trangThai || 'Chưa mở đăng ký',
        ghiChu || null,
        maLopHoc
      ]
    );

    res.status(200).json({ message: 'Cập nhật lớp học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const xoaLopHoc = async (req,res)=>{
  const { maLopHoc } = req.body;
  const trangThai = "Đã khóa";

  try {
    const [lopHoc] = await pool.query('SELECT * FROM LopHoc WHERE maLopHoc = ?', [maLopHoc]);
    if (lopHoc.length === 0) return res.status(400).json({ message: 'Lớp học không tồn tại.' });

    await pool.query('UPDATE LopHoc SET trangThai = ? WHERE maLopHoc = ?', [trangThai, maLopHoc]);

    res.json({ message: `Lớp học ${maLopHoc} đã bị khóa` });
  } catch (error) {
    res.status(500).json({ message: 'Khóa lớp học không thành công', error });
  }
}

module.exports = { getLopHoc, createLopHoc, updateLopHoc, xoaLopHoc};