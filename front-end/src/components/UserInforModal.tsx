import React from 'react';
import { Modal, Button } from 'antd';
import { NhanVienType } from '../types/NhanVienType';

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  userInfo: NhanVienType | null; 
  onLogout: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, userInfo }) => {
  return (
    <Modal
      title="Thông tin người dùng"
      visible={visible}
      onCancel={onCancel}
      footer={[

      ]}
    >
      <p><strong>Mã nhân viên:</strong> {userInfo?.maNhanVien}</p>
      <p><strong>Tên:</strong> {userInfo?.tenNhanVien}</p>
      <p><strong>Email:</strong> {userInfo?.email}</p>
      <p><strong>Email:</strong> {userInfo?.sdt}</p>
      <p><strong>Ngày Sinh:</strong> {userInfo?.ngaySinh}</p>
      <p><strong>Địa Chỉ:</strong> {userInfo?.diaChi}</p>
      <p><strong>Giới Tính :</strong> {userInfo?.gioiTinh}</p>
      <p><strong>Địa Chỉ:</strong> {userInfo?.diaChi}</p>
  
    </Modal>
  );
};

export default UserInfoModal;
