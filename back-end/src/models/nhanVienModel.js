const db = require('../config/db'); // Import kết nối cơ sở dữ liệu

// Lấy tất cả nhân viên
exports.getAllNhanVien = (callback) => {
    db.query('SELECT * FROM NhanVien', (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Thêm nhân viên
exports.addNhanVien = (newNhanVien, callback) => {
    const query = 'INSERT INTO NhanVien SET ?';
    db.query(query, newNhanVien, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Cập nhật thông tin nhân viên
exports.updateNhanVien = (maNhanVien, updatedNhanVien, callback) => {
    const query = 'UPDATE NhanVien SET ? WHERE maNhanVien = ?';
    db.query(query, [updatedNhanVien, maNhanVien], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Xóa nhân viên
exports.deleteNhanVien = (maNhanVien, callback) => {
    const query = 'DELETE FROM NhanVien WHERE maNhanVien = ?';
    db.query(query, maNhanVien, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Tìm nhân viên theo mã nhân viên
exports.findNhanVienById = (maNhanVien, callback) => {
    const query = 'SELECT * FROM NhanVien WHERE maNhanVien = ?';
    db.query(query, [maNhanVien], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        // Check if employee was found
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};
