import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import moment from 'moment';
import { LopHocType } from '../types/LopHocType';

interface SuaLopHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues: LopHocType | null; 
}

const SuaLopHocModal: React.FC<SuaLopHocModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        ngayBatDau: initialValues.ngayBatDau ? moment(initialValues.ngayBatDau, 'DD/MM/YYYY') : null, 
      });
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('DD/MM/YYYY') : null, 
        };
        onSubmit(formattedValues); 
        form.resetFields(); 
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Lớp Học"
      visible={visible}
      onCancel={() => {
        form.resetFields(); // Reset form khi modal bị hủy
        onCancel(); // Gọi hàm onCancel từ component cha
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maLopHoc"
          label="Mã Lớp Học"
          rules={[{ required: true, message: 'Vui lòng nhập mã lớp học!' }]}
        >
          <Input disabled /> {/* Không cho phép thay đổi mã lớp học */}
        </Form.Item>
        <Form.Item
          name="tenLopHoc"
          label="Tên Lớp Học"
          rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="maMonHoc"
          label="Mã Môn Học"
          rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="maGiangVien"
          label="Mã Giảng Viên"
          rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ngayBatDau"
          label="Ngày Bắt Đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="soLuong"
          label="Số Lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Tình Trạng"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Còn trống">Còn trống</Select.Option>
            <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
            <Select.Option value="Tạm ngưng">Tạm ngưng</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi Chú">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaLopHocModal;
