import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, message } from 'antd';
import axios from 'axios';
import { HocVienType } from '../types/HocVienType';
import moment from 'moment';

interface ThemHocVienModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: HocVienType) => void;
}

const ThemHocVienModal: React.FC<ThemHocVienModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        gioiTinh: 'Nam',
        ngaySinh: moment(),
        ngayVaoHoc: moment(),
      });
    }
  }, [visible, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          tenHocVien: values.tenHocVien,
          img: values.img || null,
          ngayVaoHoc: values.ngayVaoHoc ? values.ngayVaoHoc.format('YYYY-MM-DD') : null,
          ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
          gioiTinh: values.gioiTinh,
          sdt: values.sdt || null,
          email: values.email || null,
          diaChi: values.diaChi || null,
          tinhTrang: values.tinhTrang,
          ghiChu: values.ghiChu || null,
        };

        axios.post('http://localhost:8081/api/hocvien/them-hocvien', { hocViens: [formattedValues] }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(() => {
            message.success('Thêm học viên thành công');
            onSubmit(formattedValues as HocVienType);
            form.resetFields();
            onCancel();
          })
          .catch((error) => {
            message.error('Lỗi khi thêm học viên: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm Học Viên"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      style={{ top: 10 }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm Học Viên
        </Button>,
      ]}
    >
      <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenHocVien"
            label="Tên Học Viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên học viên!' }]}
          >
            <Input placeholder="Nhập tên học viên" />
          </Form.Item>
          {/* <Form.Item
            name="img"
            label="URL Ảnh"
          >
            <Input placeholder="URL hình ảnh" />
          </Form.Item> */}
          <Form.Item
            name="ngayVaoHoc"
            label="Ngày Vào Học"
          >
            <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày vào học" />
          </Form.Item>
          <Form.Item
            name="ngaySinh"
            label="Ngày Sinh"
            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
          >
            <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
          </Form.Item>
          <Form.Item
            name="gioiTinh"
            label="Giới Tính"
          >
            <Radio.Group>
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="sdt"
            label="Số Điện Thoại"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="diaChi"
            label="Địa Chỉ"
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi Chú"
          >
            <Input.TextArea placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ThemHocVienModal;
