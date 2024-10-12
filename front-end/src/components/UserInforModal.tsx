import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust the import path as needed
import { NhanVienType } from '../types/NhanVienType';

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void; 
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, onLogout }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo); // Get userInfo from Redux state
  const [nhanVien, setNhanVien] = useState<NhanVienType | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    const fetchTaiKhoan = async () => {
      if (userInfo && userInfo.maNhanVien) {
        setLoading(true); 
        try {
          const response = await axios.get('http://localhost:8081/api/auth/ds-taikhoan', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, 
            },
          });
          
          const danhSachTaiKhoan: NhanVienType[] = response.data; 
          const nhanVienData = danhSachTaiKhoan.find(tk => tk.maNhanVien === userInfo.maNhanVien); 
          setNhanVien(nhanVienData || null); 
        } catch (error) {
          message.error('Lỗi khi lấy thông tin tài khoản'); 
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaiKhoan(); 
  }, [userInfo]);

  return (
    <Modal 
      visible={visible} 
      onCancel={onCancel} 
      footer={null} 
      title="Thông Tin Người Dùng"
    >
      {loading ? (
        <Spin size="large" />
      ) : nhanVien ? (
        <Descriptions bordered>
          <Descriptions.Item label="Mã Nhân Viên">{nhanVien.maNhanVien}</Descriptions.Item>
          <Descriptions.Item label="Tên Nhân Viên">{nhanVien.tenNhanVien}</Descriptions.Item>
          <Descriptions.Item label="Giới Tính">{nhanVien.gioiTinh}</Descriptions.Item>
          <Descriptions.Item label="Ngày Sinh">{nhanVien.ngaySinh}</Descriptions.Item>
          <Descriptions.Item label="Số Điện Thoại">{nhanVien.sdt}</Descriptions.Item>
          <Descriptions.Item label="Email">{nhanVien.email}</Descriptions.Item>
          <Descriptions.Item label="Địa Chỉ">{nhanVien.diaChi}</Descriptions.Item>
          <Descriptions.Item label="Trạng Thái">{nhanVien.trangThai}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có thông tin người dùng</p> 
      )}
    </Modal>
  );
};

export default UserInfoModal;
