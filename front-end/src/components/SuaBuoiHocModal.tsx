import React from 'react';
import { Modal, Button, Input, Form } from 'antd';
import type { BuoiHocType } from '../types/BuoiHocType'; 

interface SuaBuoiHocModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedBuoiHoc: BuoiHocType | null; 
  onSave: (updatedBuoiHoc: BuoiHocType) => void; // Hàm để lưu thông tin
}

const SuaBuoiHocModal: React.FC<SuaBuoiHocModalProps> = ({ visible, onCancel, selectedBuoiHoc, onSave }) => {
  const [form] = Form.useForm();

  // Hàm để xử lý lưu thông tin
  const handleSave = () => {
    form.validateFields().then(values => {
      const updatedBuoiHoc: BuoiHocType = {
        ...selectedBuoiHoc, // Giữ lại các thông tin cũ
        ...values, // Cập nhật các trường đã thay đổi
      };
      onSave(updatedBuoiHoc); // Gọi hàm onSave để lưu thông tin
      onCancel(); // Đóng modal
    });
  };

  return (
    <Modal
      title="Chỉnh sửa buổi học"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" initialValues={selectedBuoiHoc || {}}>
        <Form.Item
          name="tenLopHoc"
          label="Tên lớp học"
          rules={[{ required: true, message: 'Vui lòng nhập tên lớp học' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi chú"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        {/* Thêm các trường khác nếu cần thiết */}
      </Form>

      <Button onClick={onCancel} style={{ marginRight: '8px' }}>Hủy</Button>
      <Button type="primary" onClick={handleSave}>Lưu</Button>
    </Modal>
  );
};

export default SuaBuoiHocModal;
