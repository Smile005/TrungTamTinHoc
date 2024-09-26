const NhanVienModel = require('../models/nhanVienModel');

// Lấy tất cả nhân viên
exports.getNhanVien = (req, res) => {
    NhanVienModel.getAllNhanVien((err, nhanViens) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách nhân viên' });
        }
        res.json(nhanViens);
    });
};

// Thêm nhân viên
exports.addNhanVien = (req, res) => {
    const newNhanVien = req.body;
    NhanVienModel.addNhanVien(newNhanVien, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi thêm nhân viên' });
        }
        res.status(201).json({ message: 'Nhân viên đã được thêm thành công', results });
    });
};

// Cập nhật thông tin nhân viên
exports.updateNhanVien = (req, res) => {
    const maNhanVien = req.params.maNhanVien;
    const updatedNhanVien = req.body;
    NhanVienModel.updateNhanVien(maNhanVien, updatedNhanVien, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật nhân viên' });
        }
        res.json({ message: 'Thông tin nhân viên đã được cập nhật', results });
    });
};

// Xóa nhân viên
exports.deleteNhanVien = (req, res) => {
    const maNhanVien = req.params.maNhanVien;
    NhanVienModel.deleteNhanVien(maNhanVien, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi xóa nhân viên' });
        }
        res.json({ message: 'Nhân viên đã được xóa', results });
    });
};
