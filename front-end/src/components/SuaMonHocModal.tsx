import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { MonHocType } from '../types/MonHocType';

interface SuaMonHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
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
        onSubmit(values); 
        form.resetFields(); 
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Môn Học"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel(); 
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maMonHoc"
          label="Mã Môn Học"
          rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}
        >
          <Input disabled /> 
        </Form.Item>
        <Form.Item
          name="tenMonHoc"
          label="Tên Môn Học"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="soBuoiHoc"
          label="Số Buổi Học"
          rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="hocPhi"
          label="Học Phí"
          rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="moTa" label="Mô Tả">
          <Input />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
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

export default SuaMonHocModal;
