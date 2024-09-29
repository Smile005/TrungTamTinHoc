// src/components/UserInfoModal.tsx
import React from 'react';
import { Modal, Button } from 'antd';

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  userInfo: any;
  onLogout: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, userInfo, onLogout }) => {
  return (
    <Modal
      title="Thông tin người dùng"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="logout" type="primary" onClick={onLogout}>
          Đăng xuất
        </Button>,
      ]}
    >
      <p><strong>Mã nhân viên:</strong> {userInfo?.maNhanVien}</p>
      <p><strong>Tên:</strong> {userInfo?.name}</p>
      <p><strong>Email:</strong> {userInfo?.email}</p>
    </Modal>
  );
};

export default UserInfoModal;
