import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, message, Select } from 'antd';
import axios from 'axios';
import { HocVienType } from '../types/HocVienType';
import moment from 'moment';

interface ThemHocVienModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: HocVienType) => void;
}

const ThemHocVienModal: React.FC<ThemHocVienModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset form fields when modal is shown
      form.setFieldsValue({
        gioiTinh: 'Nam',
        ngaySinh: moment(), // Default to today's date
      });
    }
  }, [visible, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Format the data to match HocVienType interface
        const formattedValues: HocVienType = {
          key: values.maHocVien, // Assuming maHocVien is unique and used as the key
          maHocVien: values.maHocVien,
          tenHocVien: values.tenHocVien,
          img: imageUrl || undefined, // Use the uploaded image URL or undefined
          ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : undefined, // Format date to string
          gioiTinh: values.gioiTinh,
          sdt: values.sdt || undefined,
          email: values.email || undefined,
          diaChi: values.diaChi || undefined,
          tinhTrang: values.tinhTrang,
          ghiChu: values.ghiChu || undefined,
        };

        // Call the API to add the student
        axios
          .post('http://localhost:8081/api/hocvien/them-hocvien', formattedValues, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            message.success('Thêm học viên thành công');
            onSubmit(formattedValues); // Callback to refresh the list of students
            form.resetFields(); // Reset the form fields after successful submission
            setImageUrl(null); // Reset the uploaded image
            onCancel(); // Close the modal
          })
          .catch((error) => {
            message.error('Lỗi khi thêm học viên: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm Học Viên"
      visible={visible}
      onCancel={() => {
        form.resetFields(); // Reset fields on cancel
        onCancel(); // Close modal
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm Học Viên
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maHocVien"
          label="Mã Học Viên"
          rules={[{ required: true, message: 'Vui lòng nhập mã học viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="tenHocVien"
          label="Tên Học Viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên học viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ngaySinh"
          label="Ngày Sinh"
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="gioiTinh"
          label="Giới Tính"
        >
          <Radio.Group>
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="sdt"
          label="Số Điện Thoại"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="diaChi"
          label="Địa Chỉ"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="tinhTrang"
          label="Tình Trạng"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Đang Học">Đang Học</Select.Option>
            <Select.Option value="Đã Tốt Nghiệp">Đã Tốt Nghiệp</Select.Option>
            <Select.Option value="Chưa Đăng Ký">Chưa Đăng Ký</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemHocVienModal;
