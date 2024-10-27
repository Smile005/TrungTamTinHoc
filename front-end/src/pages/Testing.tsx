import React, { useState } from 'react';
import { Button } from 'antd';
import DangKyLopHoc from '../components/DangKyLopHoc';
import { HocVienType } from '../types/HocVienType';

const hocVienMau: HocVienType = {
  key: '1',                      // Key dùng để phân biệt đối tượng trong danh sách
  maHocVien: 'HV00004',             // Mã học viên, khóa chính
  tenHocVien: 'Nguyễn Văn C',     // Tên học viên
  img: 'https://example.com/image.jpg', // Link ảnh, có thể null
  ngayVaoHoc: '2024-01-15',       // Ngày vào học, sử dụng định dạng chuỗi yyyy-mm-dd
  ngaySinh: '1998-05-20',         // Ngày sinh, định dạng chuỗi yyyy-mm-dd
  gioiTinh: 'Nam',                // Giới tính
  sdt: '0123456789',              // Số điện thoại
  email: 'nguyenvana@example.com', // Email
  diaChi: '123 Đường ABC, Quận X', // Địa chỉ
  tinhTrang: 'Đang học',          // Tình trạng học viên
  ghiChu: 'Ghi chú về học viên',  // Ghi chú, có thể null
};

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setCurrent(0); 
  };

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Open Steps Modal
      </Button>
      <DangKyLopHoc
        visible={visible}
        onCancel={closeModal}
        hocVien={hocVienMau}
      />
    </>
  );
};

export default App;
