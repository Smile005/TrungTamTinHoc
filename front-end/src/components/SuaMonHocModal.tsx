import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { MonHocType } from '../types/MonHocType';

interface SuaMonHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: MonHocType) => void;
  initialValues?: MonHocType | null;
}

const SuaMonHocModal: React.FC<SuaMonHocModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
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
          maMonHoc: initialValues?.maMonHoc,
          tenMonHoc: values.tenMonHoc,
          soBuoiHoc: values.soBuoiHoc || null,
          hocPhi: values.hocPhi || null,
          moTa: values.moTa || null,
          trangThai: values.trangThai,
          ghiChu: values.ghiChu || undefined,
        };

        axios
          .put('http://localhost:8081/api/monhoc/sua-monhoc', formattedValues, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            message.success('Cập nhật môn học thành công');
            onSubmit(formattedValues as MonHocType);
            form.resetFields();
            onCancel();
          })
          .catch((error) => {
            message.error('Lỗi khi cập nhật môn học: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Môn Học"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="maMonHoc"
            label="Mã Môn Học"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}
          >
            <Input disabled placeholder="Mã môn học tự động" />
          </Form.Item>
          <Form.Item
            name="tenMonHoc"
            label="Tên Môn Học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
          <Form.Item
            name="soBuoiHoc"
            label="Số Buổi Học"
            rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số buổi học" />
          </Form.Item>
          <Form.Item
            name="hocPhi"
            label="Học Phí"
            rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập học phí" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô Tả">
            <Input.TextArea placeholder="Nhập mô tả môn học" />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái môn học">
              <Select.Option value="Đang Giảng Dạy">Đang Giảng Dạy</Select.Option>
              <Select.Option value="Tạm ngưng">Tạm ngưng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi Chú">
            <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SuaMonHocModal;
