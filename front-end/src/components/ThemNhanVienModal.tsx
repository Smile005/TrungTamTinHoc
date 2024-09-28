import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio } from 'antd';

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
                onSubmit(values); // Gửi dữ liệu về component cha khi submit
                form.resetFields(); // Reset form sau khi submit
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
                form.resetFields(); // Reset form khi modal bị hủy
                onCancel(); // Gọi hàm onCancel từ component cha
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

export default ThemNhanVienModal;
