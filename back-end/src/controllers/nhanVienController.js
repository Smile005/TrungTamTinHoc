const NhanVienModel = require('../models/nhanVienModel'); // Import model để thao tác với cơ sở dữ liệu

// Lấy tất cả nhân viên
exports.getNhanVien = (req, res) => {
    NhanVienModel.getAllNhanVien((err, nhanViens) => {
        if (err) {
            // Trả về lỗi nếu có sự cố xảy ra khi lấy danh sách nhân viên
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách nhân viên' });
        }
        // Trả về danh sách nhân viên nếu không có lỗi
        res.json(nhanViens);
    });
};

// Thêm nhân viên
exports.addNhanVien = (req, res) => {
    const newNhanVien = req.body; // Dữ liệu nhân viên mới từ yêu cầu HTTP
    NhanVienModel.addNhanVien(newNhanVien, (err, results) => {
        if (err) {
            // Trả về lỗi nếu có sự cố xảy ra khi thêm nhân viên
            return res.status(500).json({ error: 'Lỗi khi thêm nhân viên' });
        }
        // Trả về kết quả nếu thêm thành công
        res.status(201).json({ message: 'Nhân viên đã được thêm thành công', results });
    });
};

// Cập nhật thông tin nhân viên
exports.updateNhanVien = (req, res) => {
    const maNhanVien = req.params.maNhanVien; // Mã nhân viên từ URL
    const updatedNhanVien = req.body; // Dữ liệu cập nhật từ yêu cầu HTTP
    NhanVienModel.updateNhanVien(maNhanVien, updatedNhanVien, (err, results) => {
        if (err) {
            // Trả về lỗi nếu có sự cố xảy ra khi cập nhật nhân viên
            return res.status(500).json({ error: 'Lỗi khi cập nhật nhân viên' });
        }
        // Trả về kết quả nếu cập nhật thành công
        res.json({ message: 'Thông tin nhân viên đã được cập nhật', results });
    });
};

// Xóa nhân viên
exports.deleteNhanVien = (req, res) => {
    const maNhanVien = req.params.maNhanVien; // Mã nhân viên từ URL
    NhanVienModel.deleteNhanVien(maNhanVien, (err, results) => {
        if (err) {
            // Trả về lỗi nếu có sự cố xảy ra khi xóa nhân viên
            return res.status(500).json({ error: 'Lỗi khi xóa nhân viên' });
        }
        // Trả về kết quả nếu xóa thành công
        res.json({ message: 'Nhân viên đã được xóa', results });
    });
};

// Tìm nhân viên theo mã nhân viên
exports.findNhanVienById = (req, res) => {
    const maNhanVien = req.params.maNhanVien; // Mã nhân viên từ URL
    NhanVienModel.findNhanVienById(maNhanVien, (err, nhanVien) => {
        if (err) {
            // Trả về lỗi nếu có sự cố xảy ra khi tìm kiếm nhân viên
            return res.status(500).json({ error: 'Lỗi khi tìm nhân viên' });
        }
        if (!nhanVien) {
            // Trả về lỗi nếu không tìm thấy nhân viên
            return res.status(404).json({ error: 'Nhân viên không tồn tại' });
        }
        // Trả về kết quả nếu tìm thấy nhân viên
        res.json(nhanVien);
    });
};