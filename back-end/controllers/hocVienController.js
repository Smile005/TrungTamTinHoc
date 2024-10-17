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
    const query = `SELECT COUNT(maHocVien) AS soLuong FROM HocVien;`;
    const [result] = await connection.query(query);
    const soLuong = result[0].soLuong || 0;
    const nextMaHocVien = `HV${(soLuong + 1).toString().padStart(5, '0')}`;
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
      const { tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu } = hocVien;

      if (!tenHocVien) {
        console.log('Học viên bị bỏ qua do thiếu tên:', hocVien);
        continue; 
      }

      const maHocVien = await createMaHV(connection);

      await connection.query(
        'INSERT INTO HocVien (maHocVien, tenHocVien, ngayVaoHoc, ngaySinh, gioiTinh, sdt, email, diaChi, tinhTrang, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          maHocVien,
          tenHocVien,
          ngayVaoHoc || new Date(),
          ngaySinh || null,
          gioiTinh || null,
          sdt || null,
          email || null,
          diaChi || null,
          tinhTrang || 'Đang hoạt động',
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
  const trangThai = "Đã khóa";

  try {
      const [user] = await pool.query('SELECT * FROM HocVien WHERE maHocVien = ?', [maHocVien]);
      if (user.length === 0) return res.status(400).json({ message: 'Học viên không tồn tại.' });

      await pool.query('UPDATE HocVien SET trangThai = ? WHERE maHocVien = ?', [trangThai, maHocVien]);

      res.json({ message: `Học viên ${maHocVien} đã bị khóa` });
  } catch (error) {
      res.status(500).json({ message: 'Khóa học viên không thành công', error });
  }
}

module.exports = { getHocVien, createHocVien, updateHocVien, xoaHocVien };
