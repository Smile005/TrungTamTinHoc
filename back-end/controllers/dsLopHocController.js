const pool = require('../config/db');
const XLSX = require('xlsx');

const getDS_Lop = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM DsLopHoc');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};


const getDS_LopHV = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { maHocVien } = req.body;

    if (!maHocVien) {
      return res.status(400).json({ message: 'Mã học viên là bắt buộc.' });
    }

    const [dsLop] = await connection.query(
      'SELECT * FROM DsLopHoc WHERE maHocVien = ? AND trangThai = ?',
      [maHocVien, 'Chưa đóng học phí']
    );

    res.status(200).json({ message: `Danh sách lớp học của học viên có mã ${maHocVien}`, dsLop });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const getDS_maHV02 = async (req, res) => {
  const { maHocVien } = req.params;  // Lấy maHocVien từ URL params

  try {
    const [results] = await pool.query(`
      SELECT 
        hv.maHocVien,
        hv.tenHocVien,
        mh.maMonHoc,
        mh.tenMonHoc,
        dl.maLopHoc,
        lh.tenLopHoc,  
        dl.trangThai,
        mh.hocPhi
      FROM 
        DsLopHoc dl
      JOIN 
        HocVien hv ON dl.maHocVien = hv.maHocVien
      JOIN 
        LopHoc lh ON dl.maLopHoc = lh.maLopHoc
      JOIN 
        MonHoc mh ON lh.maMonHoc = mh.maMonHoc
      WHERE 
        dl.maHocVien = ? AND dl.trangThai = 'Chưa đóng học phí';
    `, [maHocVien]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học nào với trạng thái "Chưa đóng học phí" cho học viên này' });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách lớp học', error });
  }
};

const getDS_Lop02 = async (req, res) => {
  const { maLopHoc } = req.body;

  try {
    const [results] = await pool.query(`
            SELECT 
                hv.maHocVien,
                hv.tenHocVien,
                dl.ghiChu
            FROM 
                DsLopHoc dl
            JOIN 
                HocVien hv ON dl.maHocVien = hv.maHocVien
            WHERE 
                dl.maLopHoc = ?
        `, [maLopHoc]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy học viên cho mã lớp học này' });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách học viên', error });
  }
};

const xepLop = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { maLopHoc, maHocVien } = req.body;
    const trangThai = "Chưa đóng học phí";

    // Validate input
    if (!maLopHoc || !maHocVien) {
      return res.status(400).json({ message: 'Mã lớp học và mã học viên là bắt buộc.' });
    }

    await connection.beginTransaction();

    // Check if the class exists and get the total allowed students (soLuong)
    const [lopHocRecord] = await connection.query(
      'SELECT trangThai, soLuong FROM LopHoc WHERE maLopHoc = ?',
      [maLopHoc]
    );

    if (lopHocRecord.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Lớp học không tồn tại.' });
    }

    // Check the status of the class
    if (lopHocRecord[0].trangThai !== "Có thể đăng ký") {
      await connection.rollback();
      return res.status(403).json({ message: 'Lớp học chưa mở đăng ký.' });
    }

    const soLuong = lopHocRecord[0].soLuong;

    // Check if the class is full by counting current students
    const [countRecord] = await connection.query(
      'SELECT COUNT(*) as currentStudents FROM DsLopHoc WHERE maLopHoc = ?',
      [maLopHoc]
    );

    const currentStudents = countRecord[0].currentStudents;

    if (currentStudents >= soLuong) {
      await connection.rollback();
      return res.status(409).json({ message: 'Lớp học đã đầy.' });
    }

    // Check if the student exists
    const [hocVienRecord] = await connection.query(
      'SELECT * FROM HocVien WHERE maHocVien = ?',
      [maHocVien]
    );

    if (hocVienRecord.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Học viên không tồn tại.' });
    }

    // Check if the student is already assigned to the class
    const [existingRecord] = await connection.query(
      'SELECT * FROM DsLopHoc WHERE maLopHoc = ? AND maHocVien = ?',
      [maLopHoc, maHocVien]
    );

    if (existingRecord.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Học viên đã được xếp vào lớp này.' });
    }

    // Insert into the class assignment table
    await connection.query(
      'INSERT INTO DsLopHoc (maLopHoc, maHocVien, trangThai) VALUES (?, ?, ?)',
      [maLopHoc, maHocVien, trangThai]
    );

    await connection.commit();
    res.status(201).json({ message: 'Xếp lớp thành công.', maLopHoc, maHocVien });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};


const xoaXepLop = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { maHocVien, maLopHoc } = req.body;

    if (!maHocVien || !maLopHoc) {
      return res.status(400).json({ message: 'Mã học viên và mã lớp học là bắt buộc.' });
    }

    await connection.beginTransaction();

    const [existingRecord] = await connection.query(
      'SELECT * FROM DsLopHoc WHERE maHocVien = ? AND maLopHoc = ?',
      [maHocVien, maLopHoc]
    );

    if (existingRecord.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Học viên không tồn tại trong lớp học này.' });
    }

    await connection.query(
      'DELETE FROM DsLopHoc WHERE maHocVien = ? AND maLopHoc = ?',
      [maHocVien, maLopHoc]
    );

    await connection.commit();
    res.status(200).json({ message: 'Xóa xếp lớp thành công.', maHocVien, maLopHoc });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

const chuyenLop = async (req, res) => {

};

const diemDanh = async (req, res) => {

};

const nhapDiem = async (req, res) => {

};

const exportDsLopHocToExcel = async (req, res) => {
  const { maLopHoc } = req.params;

  try {
    const [results] = await pool.query(`
      SELECT 
        hv.maHocVien, 
        hv.tenHocVien, 
        hv.gioiTinh,
        hv.sdt,
        hv.email,
        dl.trangThai, 
        dl.ghiChu
      FROM 
        DsLopHoc dl
      JOIN 
        HocVien hv ON dl.maHocVien = hv.maHocVien
      WHERE 
        dl.maLopHoc = ?
    `, [maLopHoc]);

    if (results.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy học viên nào trong lớp có mã ${maLopHoc}.` });
    }

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Danh sách lớp ${maLopHoc}`);

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="DanhSachLop_${maLopHoc}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Xuất Excel không thành công', error });
  }
};

module.exports = { getDS_Lop, chuyenLop, xepLop, diemDanh, nhapDiem, getDS_Lop02, xoaXepLop, getDS_LopHV, getDS_maHV02, exportDsLopHocToExcel };