import React from 'react';
import { Modal, Form, Input, TimePicker, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { CaHocType } from '../types/CaHocType';

interface ThemCaHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: CaHocType) => void;
}

const ThemCaHocModal: React.FC<ThemCaHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: CaHocType = {
                    key: values.maCa, // Mã ca học dùng làm key
                    maCa: values.maCa,
                    batDau: values.batDau ? values.batDau.format('HH:mm') : null, // Định dạng giờ bắt đầu
                    ketThuc: values.ketThuc ? values.ketThuc.format('HH:mm') : null, // Định dạng giờ kết thúc
                    trangThai: values.trangThai,
                    ghiChu: values.ghiChu || undefined, // Ghi chú có thể null
                };

                // Gửi yêu cầu thêm ca học qua API
                axios
                    .post('http://localhost:8081/api/cahoc/them-cahoc', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(() => {
                        message.success('Thêm ca học thành công');
                        onSubmit(formattedValues); // Callback để cập nhật danh sách ca học
                        form.resetFields(); // Reset form sau khi thêm thành công
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm ca học: ' + error.message);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm Ca Học"
            visible={visible}
            onCancel={() => {
                form.resetFields(); // Reset form khi modal bị hủy
                onCancel(); // Gọi hàm onCancel từ component cha
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maCa"
                    label="Mã Ca"
                    rules={[{ required: true, message: 'Vui lòng nhập mã ca!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="batDau"
                    label="Giờ Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="ketThuc"
                    label="Giờ Kết Thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
                        <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
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

export default ThemCaHocModal;
