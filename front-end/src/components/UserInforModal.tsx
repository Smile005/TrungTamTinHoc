import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import { NhanVienType } from '../types/NhanVienType';  // Import kiểu dữ liệu NhanVienType

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  userInfo: NhanVienType | null;
  onLogout: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, userInfo }) => {
  return (
    <Modal
      title="Thông Tin Người Dùng"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      {userInfo ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã Nhân Viên">{userInfo.maNhanVien}</Descriptions.Item>
          <Descriptions.Item label="Tên Nhân Viên">{userInfo.tenNhanVien}</Descriptions.Item>
          <Descriptions.Item label="Chức Vụ">{userInfo.chucVu}</Descriptions.Item>
          <Descriptions.Item label="Ngày Vào Làm">
            {userInfo.ngayVaoLam ? new Date(userInfo.ngayVaoLam).toLocaleDateString() : 'Không xác định'}
          </Descriptions.Item>
          <Descriptions.Item label="Giới Tính">{userInfo.gioiTinh}</Descriptions.Item>
          <Descriptions.Item label="Ngày Sinh">
            {userInfo.ngaySinh ? new Date(userInfo.ngaySinh).toLocaleDateString() : 'Không xác định'}
          </Descriptions.Item>
          <Descriptions.Item label="Số Điện Thoại">{userInfo.sdt}</Descriptions.Item>
          <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
          <Descriptions.Item label="Địa Chỉ">{userInfo.diaChi}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có thông tin người dùng</p>
      )}
    </Modal>
  );
};

export default UserInfoModal;
