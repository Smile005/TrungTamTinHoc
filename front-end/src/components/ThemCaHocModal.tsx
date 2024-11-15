import React from 'react';
import { Modal, Form, Input, TimePicker, Select, message, Button, Row } from 'antd';
import axios from 'axios';
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
                const formattedValues: Omit<CaHocType, 'maCa' | 'key'> = {
                    batDau: values.batDau ? values.batDau.format('HH:mm:ss') : null,
                    ketThuc: values.ketThuc ? values.ketThuc.format('HH:mm:ss') : null,
                    trangThai: values.trangThai,
                    ghiChu: values.ghiChu || null,
                };
                console.log(formattedValues);

                axios.post('http://localhost:8081/api/cahoc/them-cahoc', formattedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        message.success('Thêm ca học thành công');
                        onSubmit(formattedValues as CaHocType);
                        form.resetFields();
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.error('Lỗi từ server:', error.response.data);
                            message.error(`Lỗi từ server: ${error.response.data.message || 'Đã xảy ra lỗi trong quá trình xử lý'}`);
                        } else if (error.request) {
                            console.error('Không nhận được phản hồi từ server:', error.request);
                            message.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
                        } else {
                            console.error('Lỗi khi thiết lập yêu cầu:', error.message);
                            message.error('Đã xảy ra lỗi: ' + error.message);
                        }
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng kiểm tra lại các trường thông tin!');
            });
    };

    return (
        <Modal
            title="Thêm Ca Học"
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
                    Thêm Ca Học
                </Button>,
            ]}
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Row >
                        <Form.Item
                            name="batDau"
                            label="Giờ Bắt Đầu"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
                            style={{ marginRight: "100px" }}
                        >
                            <TimePicker format="HH:mm" placeholder="Giờ bắt đầu" />
                        </Form.Item>
                        <Form.Item
                            name="ketThuc"
                            label="Giờ Kết Thúc"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}
                        >
                            <TimePicker format="HH:mm" placeholder="Giờ kết thúc" />
                        </Form.Item>
                    </Row>
                    {/* <Form.Item
                        name="trangThai"
                        label="Tình Trạng"
                        rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                    >
                        <Select placeholder="Chọn tình trạng">
                            <Select.Option value="Đang hoạt động">Đang Hoạt Động</Select.Option>
                            <Select.Option value="Ngưng hoạt động">Ngưng Hoạt Động</Select.Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        name="ghiChu"
                        label="Ghi Chú"
                    >
                        <Input placeholder="Nhập ghi chú" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ThemCaHocModal;
