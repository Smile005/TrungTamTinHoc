import React from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
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

                axios
                    .post('http://localhost:8081/api/phonghoc/them-phong', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        message.success('Thêm phòng học thành công');
                        onSubmit({ ...response.data, key: response.data.maPhong }); 
                        form.resetFields(); 
                        onCancel(); 
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
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Thêm Phòng Học
                </Button>,
            ]}
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="soLuong"
                        label="Số Lượng"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <Input type="number" placeholder="Nhập số lượng phòng học" />
                    </Form.Item>
                    <Form.Item
                        name="trangThai"
                        label="Tình Trạng"
                        rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                    >
                        <Select placeholder="Chọn tình trạng phòng học">
                            <Select.Option value="Đang Hoạt Động">Đang Hoạt Động</Select.Option>
                            <Select.Option value="Ngưng Hoạt Động">Ngưng Hoạt Động</Select.Option>
                        </Select>
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

export default ThemPhongHocModal;
