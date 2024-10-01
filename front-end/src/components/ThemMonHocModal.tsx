import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

interface ThemMonHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const ThemMonHocModal: React.FC<ThemMonHocModalProps> = ({ visible, onCancel, onSubmit }) => {
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
            title="Thêm Môn Học"
            visible={visible}
            onCancel={() => {
                form.resetFields(); // Reset form khi modal bị hủy
                onCancel(); // Gọi hàm onCancel từ component cha
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maMonHoc"
                    label="Mã Môn Học"
                    rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="tenMonHoc"
                    label="Tên Môn Học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="soBuoiHoc"
                    label="Số Buổi Học"
                    rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="hocPhi"
                    label="Học Phí"
                    rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="moTa"
                    label="Mô Tả"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Full time">ĐANG HOẠT ĐỘNG</Select.Option>
                        <Select.Option value="Part time">NGƯNG HOẠT ĐỘNG</Select.Option>

                    </Select>
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

export default ThemMonHocModal;
