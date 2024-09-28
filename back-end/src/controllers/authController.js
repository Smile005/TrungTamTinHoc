// authController.js
const authModel = require('../models/authModel'); 

// Đăng ký tài khoản
const register = async (req, res) => {
    try {
        const { maNhanVien, matKhau, phanQuyen } = req.body;
        const newUser = await authModel.register(maNhanVien, matKhau, phanQuyen);
        return res.status(201).json({ message: 'Đăng ký tài khoản thành công', newUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { maNhanVien, matKhau } = req.body;
        const { token, user } = await authModel.login(maNhanVien, matKhau);
        return res.status(200).json({ token, user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Cập nhật trạng thái tài khoản
const updateStatus = (req, res) => {
    const { maNhanVien, trangThai } = req.body;
    try {
        const user = authModel.updateStatus(maNhanVien, trangThai);
        return res.status(200).json({ message: 'Cập nhật trạng thái thành công', user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Cập nhật phân quyền tài khoản
const updateRole = (req, res) => {
    const { maNhanVien, phanQuyen } = req.body;
    try {
        const user = authModel.updateRole(maNhanVien, phanQuyen);
        return res.status(200).json({ message: 'Cập nhật phân quyền thành công', user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { register, login, updateStatus, updateRole };
