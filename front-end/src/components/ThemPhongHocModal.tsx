import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

interface ThemPhongHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const ThemPhongHocModal: React.FC<ThemPhongHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm Phòng Học"
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maPhong"
                    label="Mã Phòng"
                    rules={[{ required: true, message: 'Vui lòng nhập mã phòng!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="soLuong"
                    label="Số Lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
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

export default ThemPhongHocModal;
