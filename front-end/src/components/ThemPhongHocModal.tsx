import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { PhongHocType } from '../types/PhongHocType';

interface ThemPhongHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: PhongHocType) => void;
}

const ThemPhongHocModal: React.FC<ThemPhongHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: Omit<PhongHocType, 'maPhong' | 'key'> = {
                    soLuong: parseInt(values.soLuong, 10),
                    trangThai: values.trangThai,
                    ghiChu: values.ghiChu || null,
                };

                // Gửi yêu cầu thêm phòng học qua API
                axios
                    .post('http://localhost:8081/api/phonghoc/them-phong', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        message.success('Thêm phòng học thành công');
                        onSubmit({ ...response.data, key: response.data.maPhong }); // Sử dụng `maPhong` làm `key`
                        form.resetFields(); // Xóa form sau khi thêm thành công
                        onCancel(); // Đóng modal
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm phòng học: ' + error.message);
                    });
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
                    name="soLuong"
                    label="Số Lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Đang hoạt động">Đang Hoạt Động</Select.Option>
                        <Select.Option value="Ngưng hoạt động">Ngưng Hoạt Động</Select.Option>
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
