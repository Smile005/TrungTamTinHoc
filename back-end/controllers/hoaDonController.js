const pool = require('../config/db');

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

    await connection.commit();
    res.status(201).json({ message: 'Tạo hóa đơn và chi tiết hóa đơn thành công.', maHoaDon });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Lỗi server', error });
  } finally {
    connection.release();
  }
};

module.exports = { getHoaDon, createHoaDon };
