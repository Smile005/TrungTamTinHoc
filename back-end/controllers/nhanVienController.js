const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const getNhanVien = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM NhanVien');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createNhanVien = async (req, res) => {
  const { maNhanVien, tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu } = req.body;

  if (!maNhanVien || !tenNhanVien) {
    return res.status(400).json({ message: 'Mã nhân viên và tên nhân viên là bắt buộc.' });
  }

  try {
    const [existingNhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (existingNhanVien.length > 0) {
      return res.status(400).json({ message: 'Nhân viên đã tồn tại.' });
    }

    await pool.query(
      'INSERT INTO NhanVien (maNhanVien, tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        maNhanVien,
        tenNhanVien,
        chucVu || null,
        ngayVaoLam || null,
        gioiTinh || null,
        ngaySinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null
      ]
    );

    res.status(201).json({ message: 'Thêm nhân viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Thêm nhân viên không thành công', error });
  }
};

const updateNhanVien = async (req, res) => {
  const { maNhanVien } = req.params;
  const { tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu } = req.body;

  if (!tenNhanVien) {
    return res.status(400).json({ message: 'Tên nhân viên là bắt buộc.' });
  }

  try {
    const [existingNhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (existingNhanVien.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE NhanVien SET tenNhanVien = ?, chucVu = ?, ngayVaoLam = ?, gioiTinh = ?, ngaySinh = ?, sdt = ?, email = ?, diaChi = ?, trangThai = ?, ghiChu = ? WHERE maNhanVien = ?',
      [
        tenNhanVien,
        chucVu || null,
        ngayVaoLam || null,
        gioiTinh || null,
        ngaySinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null,
        maNhanVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật nhân viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật nhân viên không thành công.', error });
  }
};

const updateProfile = async (req, res) => {
  const { maNhanVien, tenNhanVien, gioiTinh, ngaySinh, sdt, email, diaChi } = req.body;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.maNhanVien !== maNhanVien) {
      return res.status(403).json({ message: 'Bạn không có quyền thay đổi thông tin cá nhân người khác.' });
    }

    const [existingNhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (existingNhanVien.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE NhanVien SET tenNhanVien = ?, chucVu = ?, ngayVaoLam = ?, gioiTinh = ?, ngaySinh = ?, sdt = ?, email = ?, diaChi = ?, trangThai = ?, ghiChu = ? WHERE maNhanVien = ?',
      [
        tenNhanVien,
        chucVu || null,
        ngayVaoLam || null,
        gioiTinh || null,
        ngaySinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null,
        maNhanVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật thông tin cá nhân thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật thông tin cá nhân không thành công.', error });
  }
};

module.exports = { getNhanVien, createNhanVien, updateNhanVien, updateProfile };
