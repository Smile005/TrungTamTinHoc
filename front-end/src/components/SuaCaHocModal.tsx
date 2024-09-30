import React from 'react';
import { Modal, Form, Input, TimePicker } from 'antd';
import moment from 'moment';
import { CaHocType } from '../types/CaHocType';

interface SuaCaHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: CaHocType | null; 
}

const SuaCaHocModal: React.FC<SuaCaHocModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
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
          ...values,
          batDau: values.batDau ? values.batDau.format('HH:mm') : null,
          ketThuc: values.ketThuc ? values.ketThuc.format('HH:mm') : null,
        };
        onSubmit(formattedValues);
        form.resetFields(); 
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
      <Form form={form} layout="vertical">
        <Form.Item
          name="maCa"
          label="Mã Ca Học"
          rules={[{ required: true, message: 'Vui lòng nhập mã ca!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="batDau"
          label="Thời Gian Bắt Đầu"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          name="ketThuc"
          label="Thời Gian Kết Thúc"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng nhập trạng thái!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaCaHocModal;