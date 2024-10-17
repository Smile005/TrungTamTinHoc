const pool = require('../config/db');

const getDS_Lop = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM DsLopHoc');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

const xepLop = async (req, res) => {

};

const chuyenLop = async (req, res) => {

};

const diemDanh = async (req, res) => {

};

const nhapDiem = async (req, res) => {

};

module.exports = { getDS_Lop, chuyenLop, xepLop, diemDanh, nhapDiem };