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
          const response = await axios.post(
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
          message.success('Đã đổi quyền tài khoản thành công!');  
          onSubmit(values); 
          form.resetFields(); 
        } catch (error) {
          message.error('Có lỗi xảy ra khi đổi quyền tài khoản!');  
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
      </Form>
    </Modal>
  );
};

export default SuaTaiKhoanModal;
