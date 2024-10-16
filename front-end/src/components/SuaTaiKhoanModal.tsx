import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';  
import { TaiKhoanType } from '../types/TaiKhoanType';

interface SuaTaiKhoanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: TaiKhoanType | null;
}

const SuaTaiKhoanModal: React.FC<SuaTaiKhoanModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const token = localStorage.getItem('token'); 
          
          // Gọi API để cập nhật quyền
          await axios.post(
            'http://localhost:8081/api/auth/change-role', 
            {
              maNhanVien: values.maNhanVien, 
              phanQuyen: values.phanQuyen,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
          );

          // Gọi API để cập nhật trạng thái
          await axios.post(
            'http://localhost:8081/api/auth/update-trangthai',
            {
              maNhanVien: values.maNhanVien,
              trangThai: values.trangThai,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          message.success('Đã đổi cập nhật tài khoản thành công!');  
          onSubmit(values); 
          form.resetFields(); 
        } catch (error) {
          message.error('Có lỗi xảy ra khi cập nhật trạng thái tài khoản!');  
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Tài Khoản"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maNhanVien"
          label="Mã Nhân Viên"
          rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="phanQuyen"
          label="Phân Quyền"
          rules={[{ required: true, message: 'Vui lòng chọn phân quyền!' }]}
        >
          <Select>
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

export default SuaTaiKhoanModal;
