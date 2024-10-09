const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { maNhanVien, matKhau, phanQuyen } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(matKhau, 10);
    const role = phanQuyen || 3; 

    await pool.query('INSERT INTO TaiKhoan (maNhanVien, matKhau, phanQuyen, trangThai) VALUES (?, ?, ?, "Đang hoạt động")',
      [maNhanVien, hashedPassword, role]);

    res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const login = async (req, res) => {
  const { maNhanVien, matKhau } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    if (user.length === 0) return res.status(400).json({ message: 'Sai thông tin đăng nhập.' });

    const validPassword = await bcrypt.compare(matKhau, user[0].matKhau);
    if (!validPassword) return res.status(400).json({ message: 'Sai thông tin đăng nhập.' });

    const token = jwt.sign({ maNhanVien: user[0].maNhanVien, phanQuyen: user[0].phanQuyen }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const [nhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);

    res.json({ token, nhanVien: nhanVien[0] });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const changePassword = async (req, res) => {
  const { maNhanVien, oldPassword, newPassword } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    if (user.length === 0) return res.status(400).json({ message: 'Người dùng không tồn tại.' });

    const validPassword = await bcrypt.compare(oldPassword, user[0].matKhau);
    if (!validPassword) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE TaiKhoan SET matKhau = ? WHERE maNhanVien = ?', [hashedPassword, maNhanVien]);

    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const changeRole = async (req, res) => {
  const { maNhanVien, phanQuyen } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    if (user.length === 0) return res.status(400).json({ message: 'Người dùng không tồn tại.' });

    await pool.query('UPDATE TaiKhoan SET phanQuyen = ? WHERE maNhanVien = ?', [phanQuyen, maNhanVien]);

    res.json({ message: `Nhân viên đã được phân quyền lên mức: ${phanQuyen}` });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const getTaiKhoan = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        tk.maNhanVien,
        nv.tenNhanVien,
        nv.gioiTinh,
        DATE_FORMAT(nv.ngaySinh, '%d/%m/%Y') AS ngaySinh,
        tk.phanQuyen,
        tk.trangThai
      FROM 
        NhanVien nv
      JOIN 
        TaiKhoan tk ON nv.maNhanVien = tk.maNhanVien
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy thông tin tài khoản', error });
  }
};



module.exports = { register, login, changePassword, changeRole, getTaiKhoan };
