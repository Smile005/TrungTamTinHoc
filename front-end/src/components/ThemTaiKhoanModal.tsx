import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { NhanVienType } from '../types/NhanVienType'; 
import { TaiKhoanType } from '../types/TaiKhoanType';
import { useTranslation } from 'react-i18next';  // Import useTranslation

interface ThemTaiKhoanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  taiKhoanData: TaiKhoanType[];  
}

const ThemTaiKhoanModal: React.FC<ThemTaiKhoanModalProps> = ({ visible, onCancel, onSubmit, taiKhoanData }) => {
  const [form] = Form.useForm();
  const [nhanVienList, setNhanVienList] = useState<NhanVienType[]>([]);
  const { t } = useTranslation();  // Sử dụng useTranslation

  useEffect(() => {
    const fetchNhanVien = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNhanVienList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        message.error(t('errorFetchingEmployees'));
      }
    };

    if (visible) {
      fetchNhanVien();
    }
  }, [visible, t]);

  const filteredNhanVienList = nhanVienList.filter((nv) =>
    !taiKhoanData.some((tk) => tk.maNhanVien === nv.maNhanVien)
  );

  const validatePassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('matKhau') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(t('passwordMismatch')));
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:8081/api/auth/register',
            {
              maNhanVien: values.maNhanVien,
              matKhau: values.matKhau,
              phanQuyen: values.phanQuyen,
              trangThai: values.trangThai,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          message.success(t('addAccountSuccess'));
          onSubmit(values); 
          form.resetFields();
        } catch (error) {
          console.error('Lỗi khi thêm tài khoản:', error);
          message.error(t('addAccountFailed'));
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={t('addAccount')}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {t('add')}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t('employeeId')}
          name="maNhanVien"
          rules={[{ required: true, message: t('selectEmployeeId') }]}
        >
          <Select placeholder={t('selectEmployee')}>
            {filteredNhanVienList.map((nv) => (
              <Select.Option key={nv.maNhanVien} value={nv.maNhanVien}>
                {nv.maNhanVien} - {nv.tenNhanVien}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('password')}
          name="matKhau"
          rules={[{ required: true, message: t('enterPassword') }]}
        >
          <Input.Password placeholder={t('enterPassword')} />
        </Form.Item>

        <Form.Item
          label={t('confirmPassword')}
          name="xacNhanMatKhau"
          dependencies={['matKhau']}
          hasFeedback
          rules={[
            { required: true, message: t('confirmPassword') },
            { validator: validatePassword }, 
          ]}
        >
          <Input.Password placeholder={t('confirmPassword')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemTaiKhoanModal;
