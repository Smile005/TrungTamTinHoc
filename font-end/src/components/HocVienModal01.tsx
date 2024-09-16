import React from 'react';
import { Modal, Form, Input } from 'antd';

interface HocVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: any) => void;
    initialValues: any;
}

const HocVienModal01: React.FC<HocVienModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    // Khi modal mở, thiết lập giá trị ban đầu cho form
    React.useEffect(() => {
        if (visible) {
            form.setFieldsValue(initialValues);
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title="Chỉnh sửa học viên"
            visible={visible}
            onOk={() => {
                form.validateFields().then((values) => {
                    onOk(values); // Gửi dữ liệu về parent component khi submit
                    form.resetFields(); // Reset form sau khi submit
                });
            }}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Mã học viên"
                    name="maHocVien"
                    rules={[{ required: true, message: 'Vui lòng nhập mã học viên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Họ và tên"
                    name="tenHocVien"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Giới tính"
                    name="gioiTinh"
                    rules={[{ required: true, message: 'Vui lòng nhập giới tính!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Ngày sinh"
                    name="ngaySinh"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tình trạng"
                    name="tinhTrang"
                    rules={[{ required: true, message: 'Vui lòng nhập tình trạng!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HocVienModal01;
