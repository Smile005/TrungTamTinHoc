const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { maNhanVien, matKhau } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(matKhau, 10);

    await pool.query('INSERT INTO TaiKhoan (maNhanVien, matKhau, phanQuyen, trangThai) VALUES (?, ?, 3, "Đang hoạt động")',
      [maNhanVien, hashedPassword]);

    res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const login = async (req, res) => {
  const { maNhanVien, matKhau } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);

    if (user.length === 0) return res.status(400).json({ message: 'Tài khoản không tồn tại.' });

    if (user[0].trangThai !== "Đang hoạt động") {
      return res.status(400).json({ message: 'Tài khoản đã bị khóa.' });
    }

    const validPassword = await bcrypt.compare(matKhau, user[0].matKhau);
    if (!validPassword) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign({ maNhanVien: user[0].maNhanVien, phanQuyen: user[0].phanQuyen }, process.env.JWT_SECRET, { expiresIn: '3h' });

    const [nhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);

    res.json({ token, nhanVien: nhanVien[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = { register, login };
