import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { MonHocType } from '../types/MonHocType';

interface ThemMonHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: MonHocType) => void;
}

const ThemMonHocModal: React.FC<ThemMonHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: Omit<MonHocType, 'maMonHoc' | 'key'> = {
                    tenMonHoc: values.tenMonHoc,
                    soBuoiHoc: values.soBuoiHoc || null,
                    hocPhi: values.hocPhi || null,
                    moTa: values.moTa || null,
                    trangThai: values.trangThai || null,
                    ghiChu: values.ghiChu || undefined,
                };

                axios
                    .post('http://localhost:8081/api/monhoc/them-monhoc', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        if (response.data && response.data.maMonHoc) { 
                            message.success('Thêm môn học thành công');
                            onSubmit({
                                ...formattedValues,
                                key: response.data.maMonHoc,
                                maMonHoc: response.data.maMonHoc,
                            });
                            form.resetFields(); 
                        }
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm môn học: ' + error.message);
                    });
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
                form.resetFields(); 
                onCancel();
            }}
            onOk={handleOk} 
            style={{ top: 30}}
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="tenMonHoc"
                        label="Tên Môn Học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
                    >
                        <Input placeholder="Nhập tên môn học" />
                    </Form.Item>
                    <Form.Item
                        name="soBuoiHoc"
                        label="Số Buổi Học"
                        rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số buổi học" />
                    </Form.Item>
                    <Form.Item
                        name="hocPhi"
                        label="Học Phí"
                        rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập học phí" />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô Tả">
                        <Input.TextArea placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item
                        name="trangThai"
                        label="Trạng Thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Select.Option value="Đang Giảng Dạy">Đang Giảng Dạy</Select.Option>
                            <Select.Option value="Tạm Ngưng">Tạm Ngưng</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="ghiChu" label="Ghi Chú">
                        <Input.TextArea placeholder="Nhập ghi chú" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ThemMonHocModal;
