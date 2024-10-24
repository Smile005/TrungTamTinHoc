const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const getNhanVien = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        maNhanVien,
        tenNhanVien,
        img,
        chucVu,
        DATE_FORMAT(ngayVaoLam, '%d/%m/%Y') AS ngayVaoLam, -- Định dạng ngày vào làm
        gioiTinh,
        DATE_FORMAT(ngaySinh, '%d/%m/%Y') AS ngaySinh,     -- Định dạng ngày sinh
        sdt,
        email,
        diaChi,
        trangThai,
        ghiChu
      FROM NhanVien
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const createMaNV = async (connection) => {
  try {
    const query = `SELECT maNhanVien FROM NhanVien ORDER BY maNhanVien DESC LIMIT 1;`;
    const [result] = await connection.query(query);

    let nextMaNhanVien;

    if (result.length > 0) {
      const lastMaNhanVien = result[0].maNhanVien.toUpperCase();
      const numericPart = parseInt(lastMaNhanVien.slice(2));
      const newNumericPart = numericPart + 1;
      nextMaNhanVien = `NV${newNumericPart.toString().padStart(4, '0')}`;
    } else {
      nextMaNhanVien = 'NV0001';
    }

    return nextMaNhanVien;
  } catch (error) {
    throw new Error('Không thể tạo mã nhân viên');
  }
};

const createNhanVien = async (req, res) => {
  const connection = await pool.getConnection();
  const { nhanViens } = req.body;

  if (!nhanViens || nhanViens.length === 0) {
    return res.status(400).json({ message: 'Không thể xác định dữ liệu nhân viên.' });
  }

  try {
    await connection.beginTransaction();
    const isMultiple = Array.isArray(nhanViens);
    const addedNhanViens = [];
    const nhanVienList = isMultiple ? nhanViens : [nhanViens];

    for (let nhanVien of nhanVienList) {
      const { tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu } = nhanVien;

      if (!tenNhanVien) {
        console.log('Nhân viên bị bỏ qua do thiếu tên:', nhanVien);
        continue;
      }

      const maNhanVien = await createMaNV(connection);

      await connection.query(
        'INSERT INTO NhanVien (maNhanVien, tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          maNhanVien,
          tenNhanVien,
          chucVu || null,
          ngayVaoLam || new Date(),
          gioiTinh || null,
          ngaySinh || null,
          sdt || null,
          email || null,
          diaChi || null,
          trangThai || 'Full time',
          ghiChu || null
        ]
      );

      addedNhanViens.push(maNhanVien);
    }

    await connection.commit();

    res.status(201).json({
      message: `${addedNhanViens.length} nhân viên đã được thêm thành công.`,
      ds_NhanVien: addedNhanViens
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Thêm nhân viên không thành công', error });
  } finally {
    connection.release();
  }
};

const updateNhanVien = async (req, res) => {
  const { maNhanVien, tenNhanVien, chucVu, ngayVaoLam, gioiTinh, ngaySinh, sdt, email, diaChi, trangThai, ghiChu } = req.body;

  if (!maNhanVien || !tenNhanVien) {
    return res.status(400).json({ message: 'Mã nhân viên và tên nhân viên là bắt buộc.' });
  }

  try {
    const [existingNhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (existingNhanVien.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE NhanVien SET tenNhanVien = ?, chucVu = ?, ngayVaoLam = ?, gioiTinh = ?, ngaySinh = ?, sdt = ?, email = ?, diaChi = ?, trangThai = ?, ghiChu = ? WHERE maNhanVien = ?',
      [
        tenNhanVien,
        chucVu || null,
        ngayVaoLam || null,
        gioiTinh || null,
        ngaySinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        trangThai || 'Đang hoạt động',
        ghiChu || null,
        maNhanVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật nhân viên thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật nhân viên không thành công.', error });
  }
};

const updateProfile = async (req, res) => {
  const { maNhanVien, tenNhanVien, gioiTinh, ngaySinh, sdt, email, diaChi } = req.body;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.maNhanVien !== maNhanVien) {
      return res.status(403).json({ message: 'Bạn không có quyền thay đổi thông tin cá nhân người khác.' });
    }

    const [existingNhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (existingNhanVien.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
    }

    await pool.query(
      'UPDATE NhanVien SET tenNhanVien = ?, chucVu = ?, ngayVaoLam = ?, gioiTinh = ?, ngaySinh = ?, sdt = ?, email = ?, diaChi = ?, trangThai = ?, ghiChu = ? WHERE maNhanVien = ?',
      [
        tenNhanVien,
        null,
        null,
        gioiTinh || null,
        ngaySinh || null,
        sdt || null,
        email || null,
        diaChi || null,
        'Đang hoạt động',
        null,
        maNhanVien
      ]
    );

    res.status(200).json({ message: 'Cập nhật thông tin cá nhân thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật thông tin cá nhân không thành công.', error });
  }
};

const xoaNhanVien = async (req, res) => {
  const { maNhanVien } = req.body;

  try {
    const [nhanVien] = await pool.query('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);
    if (nhanVien.length === 0) return res.status(400).json({ message: 'Nhân viên không tồn tại.' });

    await pool.query('DELETE FROM TaiKhoan WHERE maNhanVien = ?', [maNhanVien]);
    
    await pool.query('DELETE FROM NhanVien WHERE maNhanVien = ?', [maNhanVien]);

    res.json({ message: `Nhân viên ${maNhanVien} đã bị xóa` });
  } catch (error) {
    res.status(500).json({ message: 'Xóa nhân viên không thành công', error });
  }
}

module.exports = { getNhanVien, createNhanVien, updateNhanVien, updateProfile, xoaNhanVien };
