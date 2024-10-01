const pool = require('../config/db');

const getHocVien = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM HocVien');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createHocVien = async (req, res) => {
  const { maHocVien, tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu } = req.body;

  if (!maHocVien || !tenHocVien) {
    return res.status(400).json({ message: 'Mã học viên và tên học viên là bắt buộc.' });
  }

  try {
    const [existingHocVien] = await pool.query('SELECT * FROM HocVien WHERE maHocVien = ?', [maHocVien]);
    if (existingHocVien.length > 0) {
      return res.status(400).json({ message: 'Học viên đã tồn tại.' });
    }

    await pool.query(
      'INSERT INTO HocVien (maHocVien, tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        maHocVien,
        tenHocVien,
        ngayVaoHoc || null,      
        ngaySinh || null,
        gioiTinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        tinhTrang || 'Đang hoạt động', 
        ghiChu || null
      ]
    );

    res.status(201).json({ message: 'Thêm học viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Thêm học viên thất bại.', error });
  }
};

const updateHocVien = async (req, res) => {
  const { maHocVien } = req.params;
  const { tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu } = req.body;

  if (!tenHocVien) {
    return res.status(400).json({ message: 'Tên học viên là bắt buộc.' });
  }

  try {
    const [existingHocVien] = await pool.query('SELECT * FROM HocVien WHERE maHocVien = ?', [maHocVien]);
    if (existingHocVien.length === 0) {
      return res.status(404).json({ message: 'Học viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE HocVien SET tenHocVien = ?, ngayVaoHoc = ?, ngaySinh = ?, gioiTinh = ?, sdt = ?, email = ?, diaChi = ?, tinhTrang = ?, ghiChu = ? WHERE maHocVien = ?',
      [
        tenHocVien,
        ngayVaoHoc || null,
        ngaySinh || null,
        gioiTinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        tinhTrang || 'Đang hoạt động', 
        ghiChu || null,
        maHocVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật học viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật học viên thất bại.', error });
  }
};

module.exports = { getHocVien, createHocVien, updateHocVien };
