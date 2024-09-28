const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const bcrypt = require('bcrypt'); 

router.post('/login', (req, res) => {
    const { maNhanVien, matKhau } = req.body; 

    const query = 'SELECT * FROM TaiKhoan WHERE maNhanVien = ?';
    db.query(query, [maNhanVien], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi hệ thống, không thể truy vấn dữ liệu.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        const user = results[0];

        if (matKhau === user.matKhau) { 
            return res.status(200).json({ message: 'Đăng nhập thành công!', user });
        } else {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }
    });
});

module.exports = router;
