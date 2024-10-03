import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message } from 'antd';
import axios from 'axios';

interface ThemNhanVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const ThemNhanVienModal: React.FC<ThemNhanVienModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues = {
                    maNhanVien: values.maNhanVien,
                    tenNhanVien: values.tenNhanVien,
                    gioiTinh: values.gioiTinh,
                    ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
                    trangThai: values.trangThai
                };

                axios.post('http://localhost:8081/api/nhanvien/them-nhanvien', formattedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                    .then(() => {
                        message.success('Thêm nhân viên thành công');
                        onSubmit(formattedValues);
                        form.resetFields();
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm nhân viên: ' + error.message);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm Nhân Viên"
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maNhanVien"
                    label="Mã Nhân Viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="tenNhanVien"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                >
                    <Input />
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
                    name="ngaySinh"
                    label="Ngày Sinh"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="tinhTrang"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Đang Học">Đang Học</Select.Option>
                        <Select.Option value="Đã Tốt Nghiệp">Đã Tốt Nghiệp</Select.Option>
                        <Select.Option value="Chưa Đăng Ký">Chưa Đăng Ký</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemNhanVienModal;
