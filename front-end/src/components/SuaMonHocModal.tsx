import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { MonHocType } from '../types/MonHocType';

interface SuaMonHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: MonHocType) => void;
  initialValues?: MonHocType | null; // Giá trị ban đầu, có thể là null
}

const SuaMonHocModal: React.FC<SuaMonHocModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Khi mở modal, set các giá trị ban đầu cho form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        maMonHoc: initialValues.maMonHoc,
        tenMonHoc: initialValues.tenMonHoc,
        soBuoiHoc: initialValues.soBuoiHoc,
        hocPhi: initialValues.hocPhi,
        moTa: initialValues.moTa,
        trangThai: initialValues.trangThai,
        ghiChu: initialValues.ghiChu,
      });
    }
  }, [initialValues, form]);

  // Xử lý khi nhấn OK
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Chuẩn bị dữ liệu cần cập nhật
        const formattedValues = {
          maMonHoc: initialValues?.maMonHoc, // giữ nguyên maMonHoc từ initialValues
          tenMonHoc: values.tenMonHoc,
          soBuoiHoc: values.soBuoiHoc,
          hocPhi: values.hocPhi,
          moTa: values.moTa || null,
          trangThai: values.trangThai,
          ghiChu: values.ghiChu || undefined,
        };

        // Gửi yêu cầu cập nhật môn học qua API
        axios
          .put(
            `http://localhost:8081/api/monhoc/sua-monhoc/${initialValues?.maMonHoc}`, // Sử dụng maMonHoc để cập nhật
            formattedValues,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            }
          )
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
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Đang hoạt động">Đang Giảng Dạy</Select.Option>
            <Select.Option value="Tạm ngưng">Tạm ngưng</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi Chú">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaMonHocModal;
