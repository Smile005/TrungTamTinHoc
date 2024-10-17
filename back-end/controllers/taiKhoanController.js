const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

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

const changeStatus = async (req, res) => {
    const { maNhanVien, trangThai } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Người dùng không tồn tại.' });
        }

        await pool.query('UPDATE TaiKhoan SET trangThai = ? WHERE maNhanVien = ?', [trangThai, maNhanVien]);

        res.json({ message: `Trạng thái của tài khoản: ${maNhanVien} đã đổi thành: ${trangThai}` });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

const khoaTaiKhoan = async (req, res) => {
    const { maNhanVien } = req.body;
    const trangThai = "Đã khóa";

    try {
        const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
        if (user.length === 0) return res.status(400).json({ message: 'Người dùng không tồn tại.' });

        await pool.query('UPDATE TaiKhoan SET trangThai = ? WHERE maNhanVien = ?', [trangThai, maNhanVien]);

        res.json({ message: `Tài khoản ${maNhanVien} đã bị khóa` });
    } catch (error) {
        res.status(500).json({ message: 'Khóa tài khoản không thành công', error });
    }
}

const moKhoaTaiKhoan = async (req, res) => {
    const { maNhanVien } = req.body;
    const trangThai = "Đang hoạt động";

    try {
        const [user] = await pool.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
        if (user.length === 0) return res.status(400).json({ message: 'Người dùng không tồn tại.' });

        await pool.query('UPDATE TaiKhoan SET trangThai = ? WHERE maNhanVien = ?', [trangThai, maNhanVien]);

        res.json({ message: `Tài khoản ${maNhanVien} đã được mở khóa` });
    } catch (error) {
        res.status(500).json({ message: 'Mở tài khoản không thành công', error });
    }
}

module.exports = { changePassword, changeRole, getTaiKhoan, changeStatus , khoaTaiKhoan, moKhoaTaiKhoan };
