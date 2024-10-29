const pool = require('../config/db');

const getHocVien = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM HocVien');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaHV = async (connection) => {
  try {
    const query = `SELECT maHocVien FROM HocVien ORDER BY maHocVien DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaHocVien;

    if (result.length > 0) {
      const lastMaHocVien = result[0].maHocVien.toUpperCase(); // Chuyển về chữ hoa
      const numericPart = parseInt(lastMaHocVien.slice(2)); // Lấy phần số
      const newNumericPart = numericPart + 1;
      nextMaHocVien = `HV${newNumericPart.toString().padStart(4, '0')}`; // Tạo mã mới với định dạng HVxxxxx
    } else {
      nextMaHocVien = 'HV00001'; // Nếu chưa có mã
    }

    return nextMaHocVien;
  } catch (error) {
    throw new Error('Không thể tạo mã học viên');
  }
};

const createHocVien = async (req, res) => {
  const connection = await pool.getConnection();
  const { hocViens } = req.body;

  if (!hocViens || hocViens.length === 0) {
    return res.status(400).json({ message: 'Không thể xác định dữ liệu học viên.' });
  }

  try {
    await connection.beginTransaction();
    const isMultiple = Array.isArray(hocViens);
    const addedHocViens = [];
    const hocVienList = isMultiple ? hocViens : [hocViens];

    for (let hocVien of hocVienList) {
      const { tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, ghiChu } = hocVien;

      if (!tenHocVien) {
        console.log('Học viên bị bỏ qua do thiếu tên:', hocVien);
        continue; 
      }

      const maHocVien = await createMaHV(connection);

      await connection.query(
        'INSERT INTO HocVien (maHocVien, tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Chưa Đăng Ký", ?)',
        [
          maHocVien,
          tenHocVien,
          ngayVaoHoc || new Date(),
          ngaySinh || null,
          gioiTinh || null,
          sdt || null,
          email || null,
          diaChi || null,
          ghiChu || null
        ]
      );

      addedHocViens.push(maHocVien);
    }

    await connection.commit();

    res.status(201).json({
      message: `${addedHocViens.length} học viên đã được thêm thành công.`,
      ds_HocVien: addedHocViens
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Thêm học viên không thành công', error });
  } finally {
    connection.release();
  }
};

const updateHocVien = async (req, res) => {
  const { maHocVien, tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu } = req.body;

  if (!maHocVien || !tenHocVien) {
    return res.status(400).json({ message: 'Mã học viên và tên học viên là bắt buộc.' });
  }

  try {
    const [existingHocVien] = await pool.query('SELECT * FROM HocVien WHERE maHocVien = ?', [maHocVien]);
    if (existingHocVien.length === 0) {
      return res.status(404).json({ message: 'Học viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE HocVien SET tenHocVien = ?, ngayVaoHoc = ?, ngaySinh = ?, gioiTinh = ?, sdt = ?, email = ?, diaChi = ?, tinhTrang = ?, ghiChu = ? WHERE maHocVien = ?',
      [
        tenHocVien,
        ngayVaoHoc || null,
        ngaySinh || null,
        gioiTinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        tinhTrang || 'Đang Học', 
        ghiChu || null,
        maHocVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật học viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật học viên thất bại.', error });
  }
};

const xoaHocVien = async (req, res) => {
  const { maHocVien } = req.body;

  try {
      // Kiểm tra xem học viên có tồn tại không
      const [user] = await pool.query('SELECT * FROM HocVien WHERE maHocVien = ?', [maHocVien]);
      if (user.length === 0) return res.status(400).json({ message: 'Học viên không tồn tại.' });

      // Xóa tất cả các bản ghi trong bảng DsLopHoc liên quan đến học viên này
      await pool.query('DELETE FROM DsLopHoc WHERE maHocVien = ?', [maHocVien]);

      // Xóa học viên
      await pool.query('DELETE FROM HocVien WHERE maHocVien = ?', [maHocVien]);
      
      res.json({ message: `Học viên ${maHocVien} đã bị xóa cùng với các lớp học liên quan.` });
  } catch (error) {
      res.status(500).json({ message: 'Xóa học viên không thành công', error });
  }
}


module.exports = { getHocVien, createHocVien, updateHocVien, xoaHocVien };
