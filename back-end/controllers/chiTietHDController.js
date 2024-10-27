const pool = require('../config/db');

const getChiTietHD = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM ChiTiet_HoaDon');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

const getChiTietHD02 = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM ChiTiet_HoaDon');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

module.exports = { getChiTietHD, getChiTietHD02 };