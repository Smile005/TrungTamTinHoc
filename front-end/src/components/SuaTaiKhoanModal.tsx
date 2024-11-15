import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';  
import { TaiKhoanType } from '../types/TaiKhoanType';
import { useTranslation } from 'react-i18next';  // Import useTranslation

interface SuaTaiKhoanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: TaiKhoanType | null;
}

const SuaTaiKhoanModal: React.FC<SuaTaiKhoanModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();  // Sử dụng useTranslation

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const token = localStorage.getItem('token'); 
          
          // Gọi API để cập nhật quyền
          await axios.post(
            'http://localhost:8081/api/auth/change-role', 
            {
              maNhanVien: values.maNhanVien, 
              phanQuyen: values.phanQuyen,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
          );

          // Gọi API để cập nhật trạng thái
          await axios.post(
            'http://localhost:8081/api/auth/update-trangthai',
            {
              maNhanVien: values.maNhanVien,
              trangThai: values.trangThai,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          message.success(t('updateAccountSuccess'));  
          onSubmit(values); 
          form.resetFields(); 
        } catch (error) {
          message.error(t('updateAccountFailed'));  
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={t('editAccount')}
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
            name="maNhanVien"
            label={t('employeeId')}
            rules={[{ required: true, message: t('enterEmployeeId') }]}
          >
            <Input disabled placeholder={t('employeeIdPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="phanQuyen"
            label={t('role')}
            rules={[{ required: true, message: t('selectRole') }]}
          >
            <Select placeholder={t('selectRolePlaceholder')}>
              <Select.Option value={1}>{t('admin')}</Select.Option>
              <Select.Option value={2}>{t('user')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('status')}
            name="trangThai"
            rules={[{ required: true, message: t('selectStatus') }]}
          >
            <Select placeholder={t('selectStatus')}>
              <Select.Option value="Đang hoạt động">{t('active')}</Select.Option>
              <Select.Option value="Đã khóa">{t('inactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SuaTaiKhoanModal;
