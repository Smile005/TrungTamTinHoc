import React from 'react';
import { Modal, Form, Input,Select } from 'antd';

interface NhanVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: any) => void;
    initialValues: any;
}

const NhanVienModal01: React.FC<NhanVienModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible) {
            form.setFieldsValue(initialValues);
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title="Chỉnh sửa nhân viên"
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
                    label="Mã nhân viên"
                    name="maNhanVien"
                    rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Họ và tên"
                    name="tenNhanVien"
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
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Full time">Full time</Select.Option>
                        <Select.Option value="Part time">Part time</Select.Option>
                        <Select.Option value="Thực tập sinh">Thực tập sinh</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NhanVienModal01;
