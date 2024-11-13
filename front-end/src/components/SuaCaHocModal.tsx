import React, { useEffect } from 'react';
import { Modal, Form, Input, TimePicker, message, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { CaHocType } from '../types/CaHocType';

interface SuaCaHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CaHocType) => void;
  initialValues?: CaHocType | null;
}

const SuaCaHocModal: React.FC<SuaCaHocModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Thiết lập giá trị ban đầu khi modal mở
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        batDau: initialValues.batDau ? moment(initialValues.batDau, 'HH:mm') : null,
        ketThuc: initialValues.ketThuc ? moment(initialValues.ketThuc, 'HH:mm') : null,
      });
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...initialValues, // Giữ lại `maCa` từ initialValues
          batDau: values.batDau ? values.batDau.format('HH:mm') : null,
          ketThuc: values.ketThuc ? values.ketThuc.format('HH:mm') : null,
          trangThai: values.trangThai,
          ghiChu: values.ghiChu || null,
        };

        axios
          .post('http://localhost:8081/api/cahoc/sua-cahoc', formattedValues, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            message.success('Sửa ca học thành công');
            onSubmit(formattedValues as CaHocType); // Callback để cập nhật dữ liệu
            form.resetFields();
          })
          .catch((error) => {
            message.error('Lỗi khi sửa ca học: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Ca Học"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="maCa"
            label="Mã Ca Học"
            rules={[{ required: true, message: 'Vui lòng nhập mã ca!' }]}
          >
            <Input disabled placeholder="Mã ca tự động" />
          </Form.Item>
          <Form.Item
            name="batDau"
            label="Thời Gian Bắt Đầu"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
          >
            <TimePicker format="HH:mm" placeholder="Chọn thời gian bắt đầu" />
          </Form.Item>
          <Form.Item
            name="ketThuc"
            label="Thời Gian Kết Thúc"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
          >
            <TimePicker format="HH:mm" placeholder="Chọn thời gian kết thúc" />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Tình Trạng"
            rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
          >
            <Select placeholder="Chọn tình trạng ca học">
              <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
              <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi Chú"
          >
            <Input placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SuaCaHocModal;
