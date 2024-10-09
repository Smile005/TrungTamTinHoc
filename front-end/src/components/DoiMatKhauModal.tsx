import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

interface DoiMatKhauModalProps {
  visible: boolean;
  onCancel: () => void;
  maNhanVien: string;
}

const DoiMatKhauModal: React.FC<DoiMatKhauModalProps> = ({ visible, onCancel, maNhanVien }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:8081/api/auth/change-password',
        {
          maNhanVien: maNhanVien, // Đổi mật khẩu theo mã nhân viên
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Đổi mật khẩu thành công!');
        form.resetFields();
        onCancel(); // Đóng modal
      } else {
        message.error('Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <Modal
      title="Đổi Mật Khẩu"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Đổi Mật Khẩu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DoiMatKhauModal;
