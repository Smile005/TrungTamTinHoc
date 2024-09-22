import React from 'react';
import { Modal, Form, Input } from 'antd';

interface ThemCaHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const ThemCaHocModal: React.FC<ThemCaHocModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values); // Gửi dữ liệu về component cha khi submit
        form.resetFields(); // Reset form sau khi submit
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm Ca Học"
      visible={visible}
      onCancel={() => {
        form.resetFields(); // Reset form khi modal bị hủy
        onCancel(); // Gọi hàm onCancel từ component cha
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maCa"
          label="Mã Ca"
          rules={[{ required: true, message: 'Vui lòng nhập mã ca!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="batDau"
          label="Thời Gian Bắt Đầu"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ketThuc"
          label="Thời Gian Kết Thúc"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng nhập trạng thái!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemCaHocModal;
