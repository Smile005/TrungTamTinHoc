// Import kết nối tới cơ sở dữ liệu
const pool = require('../config/db');
const XLSX = require('xlsx');
const moment = require('moment');

// 1. Hàm lấy tất cả các lớp học
const getLopHoc = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        LopHoc.maMonHoc, 
        MonHoc.tenMonHoc, 
        LopHoc.maLopHoc, 
        LopHoc.tenLopHoc, 
        LopHoc.maNhanVien, 
        NhanVien.tenNhanVien,
        LopHoc.soLuongMax,
        LopHoc.trangThai,
        MonHoc.soBuoiHoc, 
        LopHoc.ngayBatDau
      FROM 
        LopHoc
      JOIN 
        MonHoc ON LopHoc.maMonHoc = MonHoc.maMonHoc
      JOIN 
        NhanVien ON LopHoc.maNhanVien = NhanVien.maNhanVien`);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// 2. Hàm tìm lớp học theo mã lớp học
const getLopHocByMaLop = async (req, res) => {
  const { maLopHoc } = req.params; // Lấy mã lớp học từ URL params
  try {
    const [results] = await pool.query(`
      SELECT 
        LopHoc.maMonHoc, 
        MonHoc.tenMonHoc, 
        LopHoc.maLopHoc, 
        LopHoc.tenLopHoc, 
        LopHoc.maNhanVien, 
        NhanVien.tenNhanVien, 
        MonHoc.soBuoiHoc, 
        LopHoc.ngayBatDau
      FROM 
        LopHoc
      JOIN 
        MonHoc ON LopHoc.maMonHoc = MonHoc.maMonHoc
      JOIN 
        NhanVien ON LopHoc.maNhanVien = NhanVien.maNhanVien
      WHERE
        LopHoc.maLopHoc = ?;
    `, [maLopHoc]);

    if (results.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy lớp học có mã ${maLopHoc}` });
    }
    res.json(results[0]); // Trả về thông tin lớp học tìm thấy
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// 3. Hàm lấy danh sách các lớp học đang mở đăng ký
const getLopHocHD = async (req, res) => {
  const trangThai = 'Có thể đăng ký';

  try {
    // Truy vấn các lớp học có trạng thái 'Có thể đăng ký'
    const [results] = await pool.query(`
      SELECT LopHoc.*, 
        (SELECT COUNT(*) 
           FROM DsLopHoc 
           WHERE DsLopHoc.maLopHoc = LopHoc.maLopHoc) AS soLuongHV,
        MonHoc.soBuoiHoc,
        NhanVien.tenNhanVien AS tenGiangVien
      FROM LopHoc
      LEFT JOIN MonHoc ON LopHoc.maMonHoc = MonHoc.maMonHoc
      LEFT JOIN NhanVien ON LopHoc.maNhanVien = NhanVien.maNhanVien
      WHERE LopHoc.trangThai = ?;
    `, [trangThai]);

    // Duyệt qua các lớp học và lấy lịch học cho từng lớp
    for (let i = 0; i < results.length; i++) {
      const maLopHoc = results[i].maLopHoc;

      // Truy vấn lịch học cho từng maLopHoc
      const [lichHoc] = await pool.query(`
        SELECT thu, maCa
        FROM LichHoc
        WHERE maLopHoc = ?
        GROUP BY thu, maCa
        ORDER BY thu, maCa
      `, [maLopHoc]);

      // Tạo chuỗi lichHoc cho từng lớp học
      const daysMap = {
        0: "CN",
        1: "T2",
        2: "T3",
        3: "T4",
        4: "T5",
        5: "T6",
        6: "T7",
      };

      const lichHocChuoi = lichHoc
        .map((row) => `${daysMap[row.thu]}-${row.maCa}`)
        .join(", ");

      // Thêm lichHoc vào đối tượng kết quả của lớp học
      results[i].lichHoc = lichHocChuoi;
    }

    // Trả về kết quả đã được bổ sung lịch học
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// 4. Hàm tạo mã lớp học mới
const createMaLop = async (connection) => {
  try {
    const query = `SELECT maLopHoc FROM LopHoc ORDER BY maLopHoc DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    if (result.length > 0) {
      const lastMaLop = result[0].maLopHoc.toUpperCase();
      const numericPart = parseInt(lastMaLop.slice(2)); // Sửa slice(3) thành slice(2) để lấy đúng phần số
      const newNumericPart = numericPart + 1;
      return `LH${newNumericPart.toString().padStart(4, '0')}`;
    }
    return 'LH0001'; // Mã lớp học đầu tiên
  } catch (error) {
    throw new Error('Không thể tạo mã lớp học');
  }
};

// 5. Hàm tạo tên lớp học mới
const createTenLop = async (connection, maMonHoc) => {
  try {
    const [monHocResult] = await connection.query(
      'SELECT tenMonHoc FROM MonHoc WHERE maMonHoc = ?',
      [maMonHoc]
    );

    if (monHocResult.length === 0) {
      throw new Error(`Không tìm thấy môn học với mã ${maMonHoc}`);
    }

    const tenMonHoc = monHocResult[0].tenMonHoc;

    const [lastLopHocResult] = await connection.query(`
      SELECT tenLopHoc FROM LopHoc
      WHERE maMonHoc = ?
      ORDER BY maLopHoc DESC
      LIMIT 1
    `, [maMonHoc]);

    const nextK = lastLopHocResult.length > 0
      ? (() => {
        const match = lastLopHocResult[0].tenLopHoc.match(/K(\d+)$/);
        if (match) {
          return parseInt(match[1], 10) + 1;
        } else {
          return 1; // Nếu không khớp với định dạng, bắt đầu từ K1
        }
      })()
      : 1; // Nếu không có lớp học nào, bắt đầu với K1

    return `${tenMonHoc} K${nextK}`;
  } catch (error) {
    console.error("Lỗi khi tạo tên lớp:", error);
    throw error;
  }
};

// 6. Hàm thêm lớp học mới
const createLopHoc = async (req, res) => {
  const connection = await pool.getConnection();
  const { lopHocs } = req.body;

  if (!lopHocs || lopHocs.length === 0) {
    return res.status(400).json({ message: 'Không thể xác định dữ liệu lớp học.' });
  }

  try {
    await connection.beginTransaction();
    const addedLopHocs = [];
    const skippedLopHocs = [];

    for (const [index, lopHoc] of lopHocs.entries()) {
      const { maMonHoc, maNhanVien, ngayBatDau, soLuongMax, trangThai, ghiChu } = lopHoc;

      const missingFields = [];
      if (!maMonHoc) missingFields.push('maMonHoc');
      if (!maNhanVien) missingFields.push('maNhanVien');
      if (!ngayBatDau) missingFields.push('ngayBatDau');
      if (!soLuongMax) missingFields.push('soLuongMax');

      if (missingFields.length > 0) {
        console.log(`Lớp học thứ ${index + 1} bị bỏ qua do thiếu thông tin: ${missingFields.join(', ')}`, lopHoc);
        skippedLopHocs.push({ index: index + 1, missingFields, lopHoc });
        continue;
      }

      const maLopHoc = await createMaLop(connection);
      const tenLopHoc = await createTenLop(connection, maMonHoc);

      console.log(tenLopHoc);

      await connection.query(`
        INSERT INTO LopHoc (
            maLopHoc,
            tenLopHoc,
            maMonHoc,
            maNhanVien,
            ngayBatDau,
            soLuongMax,
            trangThai,
            ghiChu
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        maLopHoc,
        tenLopHoc,
        maMonHoc,
        maNhanVien,
        ngayBatDau,
        soLuongMax,
        trangThai || 'Chưa mở đăng ký',
        ghiChu || null
      ]);

      addedLopHocs.push(maLopHoc);
    }

    await connection.commit();

    res.status(201).json({
      message: `${addedLopHocs.length} lớp học đã được thêm thành công.`,
      ds_LopHoc: addedLopHocs,
      skippedLopHocs
    });
  } catch (error) {
    console.error('Lỗi khi thêm lớp học:', error);
    console.error('Thông báo lỗi SQL:', error.sqlMessage);
    await connection.rollback();
    res.status(500).json({ message: 'Thêm lớp học không thành công', error: error.sqlMessage || error });
  } finally {
    connection.release();
  }
};

// 7. Hàm cập nhật thông tin lớp học
const updateLopHoc = async (req, res) => {
  const { maLopHoc, tenLopHoc, maMonHoc, maNhanVien, ngayBatDau, soLuongMax, trangThai, ghiChu } = req.body;

  if (!maLopHoc || !tenLopHoc || !maMonHoc) {
    return res.status(400).json({ message: 'Mã lớp, tên lớp và mã môn học là bắt buộc.' });
  }

  try {
    const [existingLopHoc] = await pool.query('SELECT * FROM LopHoc WHERE maLopHoc = ?', [maLopHoc]);
    if (existingLopHoc.length === 0) {
      return res.status(404).json({ message: 'Lớp học không tồn tại.' });
    }

    await pool.query(`
      UPDATE LopHoc 
      SET 
        tenLopHoc = ?, 
        maMonHoc = ?, 
        maNhanVien = ?, 
        ngayBatDau = ?, 
        soLuongMax = ?, 
        trangThai = ?, 
        ghiChu = ? 
      WHERE maLopHoc = ?
    `, [
      tenLopHoc,
      maMonHoc,
      maNhanVien,
      ngayBatDau || null,
      soLuongMax || null,
      trangThai || 'Chưa mở đăng ký',
      ghiChu || null,
      maLopHoc
    ]);

    res.status(200).json({ message: 'Cập nhật lớp học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật lớp học không thành công.', error });
  }
};

// 8. Hàm xóa lớp học
const deleteLopHoc = async (req, res) => {
  const { maLopHoc } = req.params;

  try {
    const [existingLopHoc] = await pool.query('SELECT * FROM LopHoc WHERE maLopHoc = ?', [maLopHoc]);
    if (existingLopHoc.length === 0) {
      return res.status(404).json({ message: 'Lớp học không tồn tại.' });
    }

    await pool.query('DELETE FROM LopHoc WHERE maLopHoc = ?', [maLopHoc]);
    res.status(200).json({ message: 'Xóa lớp học thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Xóa lớp học không thành công.', error });
  }
};


const exportLopHocToExcel = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        LopHoc.maLopHoc, 
        LopHoc.tenLopHoc, 
        LopHoc.maMonHoc, 
        MonHoc.tenMonHoc, 
        LopHoc.maNhanVien, 
        NhanVien.tenNhanVien, 
        LopHoc.ngayBatDau, 
        LopHoc.soLuongMax, 
        LopHoc.trangThai, 
        LopHoc.ghiChu
      FROM LopHoc
      JOIN MonHoc ON LopHoc.maMonHoc = MonHoc.maMonHoc
      JOIN NhanVien ON LopHoc.maNhanVien = NhanVien.maNhanVien
    `);

    const formattedResults = results.map((row) => ({
      ...row,
      ngayBatDau: row.ngayBatDau ? moment(row.ngayBatDau).format('DD/MM/YYYY') : null,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách lớp học');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="DanhSachLopHoc.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Xuất Excel không thành công', error });
  }
};

// Xuất các hàm
module.exports = {
  getLopHoc,
  getLopHocByMaLop,
  getLopHocHD,
  createLopHoc,
  updateLopHoc,
  deleteLopHoc,
  exportLopHocToExcel
};
