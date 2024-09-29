import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
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
      .then((values) => {
        onSubmit(values);
        form.resetFields(); 
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
            <Select.Option value={3}>Người dùng</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Đã khóa">Đã khóa</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaTaiKhoanModal;
