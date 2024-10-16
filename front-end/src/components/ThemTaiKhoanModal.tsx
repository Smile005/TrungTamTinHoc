import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { NhanVienType } from '../types/NhanVienType'; 

interface ThemTaiKhoanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void; // Không cần sửa phần này, nhưng sẽ gọi API đăng ký tài khoản
}

const ThemTaiKhoanModal: React.FC<ThemTaiKhoanModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [nhanVienList, setNhanVienList] = useState<NhanVienType[]>([]); 

  useEffect(() => {
    const fetchNhanVien = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNhanVienList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        message.error('Không thể lấy danh sách nhân viên!');
      }
    };

    if (visible) {
      fetchNhanVien();
    }
  }, [visible]);

  const validatePassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('matKhau') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        // Gửi yêu cầu POST để đăng ký tài khoản mới
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:8081/api/auth/register',
            {
              maNhanVien: values.maNhanVien,
              matKhau: values.matKhau,
              phanQuyen: values.phanQuyen,
              trangThai: values.trangThai,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          message.success('Thêm tài khoản thành công!');
          onSubmit(values); // Đăng ký thành công, đóng modal
          form.resetFields();
        } catch (error) {
          console.error('Lỗi khi thêm tài khoản:', error);
          message.error('Không thể thêm tài khoản!');
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm Tài Khoản"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Nhân Viên"
          name="maNhanVien"
          rules={[{ required: true, message: 'Vui lòng chọn mã nhân viên!' }]}
        >
          <Select placeholder="Chọn mã nhân viên">
            {nhanVienList.map((nv) => (
              <Select.Option key={nv.maNhanVien} value={nv.maNhanVien}>
                {nv.maNhanVien} - {nv.tenNhanVien}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mật Khẩu"
          name="matKhau"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác Nhận Mật Khẩu"
          name="xacNhanMatKhau"
          dependencies={['matKhau']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            { validator: validatePassword }, 
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Phân Quyền"
          name="phanQuyen"
          rules={[{ required: true, message: 'Vui lòng chọn phân quyền!' }]}
        >
          <Select placeholder="Chọn phân quyền">
            <Select.Option value={1}>Quản trị viên</Select.Option>
            <Select.Option value={2}>Nhân viên</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng Thái"
          name="trangThai"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
            <Select.Option value="Đã khóa">Đã khóa</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemTaiKhoanModal;
