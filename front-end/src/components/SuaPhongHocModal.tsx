import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { PhongHocType } from '../types/PhongHocType';

interface SuaPhongHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: PhongHocType) => void;
  initialValues?: PhongHocType | null; 
}

const SuaPhongHocModal: React.FC<SuaPhongHocModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues); 
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          maPhong: initialValues?.maPhong, // Sử dụng `maPhong` từ `initialValues`
        };

        // Gửi yêu cầu cập nhật phòng học qua API
        axios
          .post('http://localhost:8081/api/phonghoc/sua-phong', formattedValues, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            message.success('Cập nhật phòng học thành công');
            onSubmit(formattedValues as PhongHocType); // Cập nhật danh sách phòng học sau khi thành công
            form.resetFields(); // Xóa các trường form sau khi xử lý xong
          })
          .catch((error) => {
            message.error('Lỗi khi cập nhật phòng học: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Phòng Học"
      visible={visible}
      onCancel={() => {
        form.resetFields(); 
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maPhong"
          label="Mã Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập mã phòng!' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="soLuong"
          label="Số Lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng chỗ ngồi!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Tình Trạng"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi Chú">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaPhongHocModal;
