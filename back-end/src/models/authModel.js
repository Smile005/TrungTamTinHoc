// authModel.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import kết nối cơ sở dữ liệu
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (maNhanVien, matKhau, phanQuyen) => {
    let taiKhoan;
    try {
        taiKhoan = await db.query('SELECT * FROM TaiKhoan'); // Example query
    } catch (error) {
        return {
            success: false,
            message: 'Lỗi khi truy xuất dữ liệu tài khoản',
            error: error.message
        };
    }

    if (!Array.isArray(taiKhoan)) {
        return {
            success: false,
            message: 'Dữ liệu tài khoản không hợp lệ',
            inputData: {
                maNhanVien,
                matKhau,
                phanQuyen
            }
        };
    }

    const existingUser = taiKhoan.find(user => user.maNhanVien === maNhanVien);
    if (existingUser) {
        return {
            success: false,
            message: 'Tài khoản đã tồn tại',
            inputData: {
                maNhanVien,
                matKhau,
                phanQuyen
            }
        };
    }

    if (!phanQuyen) {
        phanQuyen = 3; 
    }

    const trangThai = 'Đang hoạt động';
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    const insertQuery = 'INSERT INTO TaiKhoan (maNhanVien, matKhau, phanQuyen, trangThai) VALUES (?, ?, ?, ?)';
    try {
        await db.query(insertQuery, [maNhanVien, hashedPassword, phanQuyen, trangThai]);
    } catch (error) {
        return {
            success: false,
            message: 'Lỗi khi thêm tài khoản mới',
            error: error.message
        };
    }

    return {
        success: true,
        message: 'Đăng ký tài khoản thành công',
        newUser: { maNhanVien, phanQuyen, trangThai }
    };
};

const login = async (maNhanVien, matKhau) => {
    try {
        // Tìm người dùng với mã nhân viên trong cơ sở dữ liệu
        const [rows] = await db.query('SELECT * FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
        
        // Kiểm tra xem người dùng có tồn tại không
        if (rows.length === 0) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không hợp lệ');
        }

        const user = rows[0];

        // So sánh mật khẩu đã băm
        const isPasswordValid = await bcrypt.compare(matKhau, user.matKhau);
        if (!isPasswordValid) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không hợp lệ');
        }

        // Tạo token JWT
        const token = jwt.sign({
            maNhanVien: user.maNhanVien,
            phanQuyen: user.phanQuyen
        }, JWT_SECRET, { expiresIn: '1h' });

        // Trả về thông tin người dùng mà không có mật khẩu
        const { matKhau: _, ...userWithoutPassword } = user;

        return { token, user: userWithoutPassword };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Cập nhật trạng thái tài khoản
const updateStatus = (maNhanVien, trangThai) => {
    const user = db.taiKhoan.find(user => user.maNhanVien === maNhanVien);
    if (!user) {
        throw new Error('Không tìm thấy tài khoản');
    }

    user.trangThai = trangThai;
    return user;
};

// Cập nhật phân quyền tài khoản
const updateRole = (maNhanVien, phanQuyen) => {
    const user = db.taiKhoan.find(user => user.maNhanVien === maNhanVien);
    if (!user) {
        throw new Error('Không tìm thấy tài khoản');
    }

    user.phanQuyen = phanQuyen;
    return user;
};

module.exports = { register, login, updateStatus, updateRole };
