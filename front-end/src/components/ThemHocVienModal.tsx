import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { HocVienType } from '../types/HocVienType';
import moment from 'moment'; // Nhập moment để làm việc với ngày

interface ThemHocVienModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: HocVienType) => void;
}

const ThemHocVienModal: React.FC<ThemHocVienModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        gioiTinh: 'Nam', // Đặt giá trị mặc định cho gioiTinh
        ngaySinh: moment(), // Đặt giá trị mặc định cho ngày sinh là hôm nay
      });
    }
  }, [visible]);

  const handleUpload = (file: RcFile) => {
    if (!file || !(file instanceof Blob)) {
      message.error('Tệp không hợp lệ.');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
    return false; // Ngăn chặn upload tự động
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleOk = (values: HocVienType) => {
    // Chuyển đổi ngày sinh thành định dạng DD-MM-YYYY
    const formattedValues = {
      ...values,
      ngaySinh: values.ngaySinh ? moment(values.ngaySinh).format('DD/MM/YYYY') : undefined,
      tinhTrang: 'Chưa đăng ký',
      img: imageUrl || undefined
    };
    
    onSubmit(formattedValues);
    form.resetFields();
    setImageUrl(null);
  };
  
  
  return (
    <Modal
      title="Thêm Học Viên"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk}
      >
        <Form.Item
          name="maHocVien"
          label="Mã Học Viên"
          rules={[{ required: true, message: 'Vui lòng nhập mã học viên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="tenHocVien"
          label="Tên Học Viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên học viên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="ngaySinh"
          label="Ngày Sinh"
          initialValue={moment()} // Đặt giá trị mặc định là hôm nay
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /> {/* Chỉ định định dạng ngày */}
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
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="diaChi"
          label="Địa Chỉ"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="img"
          label="Ảnh Học Viên"
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={() => {}} // Ngăn chặn upload tự động
            onChange={({ file }) => handleUpload(file as RcFile)}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm Học Viên
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemHocVienModal;
