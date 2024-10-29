const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const moment = require('moment');

const getHoaDon = async (req, res) => {
  try {
    const [hoaDonResults] = await pool.query(`
      SELECT 
        HoaDon.maHoaDon,
        NhanVien.maNhanVien,
        NhanVien.tenNhanVien,
        HocVien.maHocVien,
        HocVien.tenHocVien,
        HocVien.ngaySinh,
        HocVien.sdt,
        HocVien.email,
        GROUP_CONCAT(ChiTiet_HoaDon.maLopHoc) AS maLopHocs,
        GROUP_CONCAT(DsLopHoc.trangThai) AS trangThais
      FROM HoaDon
      INNER JOIN NhanVien ON HoaDon.maNhanVien = NhanVien.maNhanVien
      INNER JOIN HocVien ON HoaDon.maHocVien = HocVien.maHocVien
      LEFT JOIN ChiTiet_HoaDon ON HoaDon.maHoaDon = ChiTiet_HoaDon.maHoaDon
      LEFT JOIN DsLopHoc ON ChiTiet_HoaDon.maLopHoc = DsLopHoc.maLopHoc
      GROUP BY HoaDon.maHoaDon
    `);

    hoaDonResults.forEach(hoaDon => {
      hoaDon.maLopHocs = hoaDon.maLopHocs ? hoaDon.maLopHocs.split(',') : [];
      hoaDon.trangThais = hoaDon.trangThais ? hoaDon.trangThais.split(',') : [];
      hoaDon.chiTietHD = hoaDon.maLopHocs.map((maLopHoc, index) => ({
        maLopHoc,
        trangThai: hoaDon.trangThais[index]
      }));

      delete hoaDon.maLopHocs;
      delete hoaDon.trangThais;
    });

    res.json(hoaDonResults);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const getHoaDonByMa = async (req, res) => {
  const connection = await pool.getConnection();
  const { maHoaDon } = req.params;

  try {
    const [hoaDon] = await connection.query(
      `SELECT 
         hd.maHoaDon, 
         hd.maNhanVien, 
         nv.tenNhanVien, 
         hd.maHocVien, 
         hv.tenHocVien,
         hv.ngaySinh,
         hv.gioiTinh, 
         hd.ngayTaoHoaDon
       FROM 
         HoaDon hd
       JOIN 
         NhanVien nv ON hd.maNhanVien = nv.maNhanVien
       JOIN 
         HocVien hv ON hd.maHocVien = hv.maHocVien
       WHERE 
         hd.maHoaDon = ?`,
      [maHoaDon]
    );

    if (hoaDon.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn." });
    }

    const [chiTietHoaDon] = await connection.query(
      `SELECT 
         mh.maMonHoc,
         mh.tenMonHoc,
         cthd.maLopHoc,
         lh.tenLopHoc,
         mh.hocPhi,
         cthd.ghiCHu
       FROM 
         ChiTiet_HoaDon cthd
       JOIN 
         LopHoc lh ON cthd.maLopHoc = lh.maLopHoc
       JOIN 
         MonHoc mh ON lh.maMonHoc = mh.maMonHoc
       WHERE 
         cthd.maHoaDon = ?`,
      [maHoaDon]
    );

    res.status(200).json({
      ...hoaDon[0],
      chiTietHoaDon: chiTietHoaDon
    });

  } catch (error) {
    res.status(500).json({ message: "Không thể tìm thấy hóa đơn theo mã", error });
  } finally {
    connection.release();
  }
};

const createMaHD = async (connection) => {
  try {
    const query = `SELECT maHoaDon FROM HoaDon ORDER BY maHoaDon DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaHoaDon;

    if (result.length > 0) {
      const lastMaHoaDon = result[0].maHoaDon;
      const numericPart = parseInt(lastMaHoaDon.slice(2));
      const newNumericPart = numericPart + 1;
      nextMaHoaDon = `HD${newNumericPart.toString().padStart(4, '0')}`;
    } else {
      nextMaHoaDon = 'HD0001';
    }

    return nextMaHoaDon;
  } catch (error) {
    throw new Error('Không thể tạo mã hóa đơn');
  }
};

const createHoaDon = async (req, res) => {
  const connection = await pool.getConnection();
  const { maNhanVien, maHocVien, ghiChu, chiTietHD, ngayTaoHoaDon } = req.body;

  if (!maNhanVien || !maHocVien) {
    return res.status(400).json({ message: 'Mã nhân viên và mã học viên là bắt buộc.' });
  }

  if (!chiTietHD || !Array.isArray(chiTietHD) || chiTietHD.length === 0) {
    return res.status(400).json({ message: 'Không thể tạo hóa đơn do không có chi tiết hóa đơn (chiTietHD).' });
  }

  try {
    await connection.beginTransaction();

    const maHoaDon = await createMaHD(connection);

    const currentDate = ngayTaoHoaDon || new Date();

    await connection.query(
      'INSERT INTO HoaDon (maHoaDon, maNhanVien, maHocVien, ngayTaoHoaDon, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?)',
      [maHoaDon, maNhanVien, maHocVien, currentDate, 'Đã Đóng Học Phí', ghiChu || ""]
    );

    for (const chiTiet of chiTietHD) {
      const { maLopHoc } = chiTiet;
      if (maLopHoc) {
        await connection.query(
          'INSERT INTO ChiTiet_HoaDon (maHoaDon, maLopHoc) VALUES (?, ?)',
          [maHoaDon, maLopHoc]
        );

        await connection.query(
          'UPDATE DsLopHoc SET trangThai = "Đã Đóng Học Phí" WHERE maLopHoc = ? AND maHocVien = ?',
          [maLopHoc, maHocVien]
        );
      }
    }

    await connection.query(
      'UPDATE HocVien SET tinhTrang = "Đang Học" WHERE maHocVien = ?',
      [maHocVien]
    );

    await connection.commit();
    res.status(201).json({ message: 'Tạo hóa đơn và chi tiết hóa đơn thành công.', maHoaDon });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};


const exportHoaDonPDF = async (req, res) => {
  const { maHoaDon } = req.params;
  const connection = await pool.getConnection();

  try {
    // Lấy thông tin hóa đơn bao gồm thông tin học viên và nhân viên
    const [hoaDon] = await connection.query(
      `SELECT 
         hd.maHoaDon, 
         hd.maNhanVien, 
         nv.tenNhanVien, 
         hd.maHocVien, 
         hv.tenHocVien,
         hv.ngaySinh,
         hv.gioiTinh, 
         hd.ngayTaoHoaDon
       FROM 
         HoaDon hd
       JOIN 
         NhanVien nv ON hd.maNhanVien = nv.maNhanVien
       JOIN 
         HocVien hv ON hd.maHocVien = hv.maHocVien
       WHERE 
         hd.maHoaDon = ?`,
      [maHoaDon]
    );

    if (hoaDon.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn." });
    }

    const [chiTietHoaDon] = await connection.query(
      `SELECT 
         mh.tenMonHoc,
         mh.hocPhi
       FROM 
         ChiTiet_HoaDon cthd
       JOIN 
         LopHoc lh ON cthd.maLopHoc = lh.maLopHoc
       JOIN 
         MonHoc mh ON lh.maMonHoc = mh.maMonHoc
       WHERE 
         cthd.maHoaDon = ?`,
      [maHoaDon]
    );

    const doc = new PDFDocument({ size: 'A4' });

    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${hoaDon[0].maHoaDon}.pdf`);

    doc.fontSize(20).text(`Hóa Đơn: ${hoaDon[0].maHoaDon}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Mã Nhân Viên: ${hoaDon[0].maNhanVien}`);
    doc.text(`Tên Nhân Viên: ${hoaDon[0].tenNhanVien}`);
    doc.text(`Mã Học Viên: ${hoaDon[0].maHocVien}`);
    doc.text(`Tên Học Viên: ${hoaDon[0].tenHocVien}`);
    doc.text(`Ngày Sinh: ${moment(hoaDon[0].ngaySinh).format('DD/MM/YYYY')}`);
    doc.text(`Giới Tính: ${hoaDon[0].gioiTinh}`);
    doc.text(`Ngày Tạo Hóa Đơn: ${moment(hoaDon[0].ngayTaoHoaDon).format('DD/MM/YYYY')}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(16).text('Chi Tiết Các Môn Học', { underline: true });
    doc.moveDown();

    chiTietHoaDon.forEach((monHoc, index) => {
      doc.fontSize(12).text(`${index + 1}. Môn Học: ${monHoc.tenMonHoc}`);
      doc.text(`Học Phí: ${monHoc.hocPhi.toLocaleString()} VND`);
      doc.moveDown();
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    const totalHocPhi = chiTietHoaDon.reduce((total, item) => total + item.hocPhi, 0);
    doc.fontSize(16).text(`Tổng Số Tiền: ${totalHocPhi.toLocaleString()} VND`, { align: 'center' });

    doc.pipe(res);
    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Không thể tạo PDF hóa đơn', error });
  } finally {
    connection.release();
  }
};



module.exports = { getHoaDon, createHoaDon, getHoaDonByMa, exportHoaDonPDF };