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
                const formattedValues: MonHocType = {
                    key: values.maMonHoc, // Mã môn học dùng làm key
                    maMonHoc: values.maMonHoc,
                    tenMonHoc: values.tenMonHoc,
                    soBuoiHoc: values.soBuoiHoc || null, // Số buổi học có thể null
                    hocPhi: values.hocPhi || null, // Học phí có thể null
                    moTa: values.moTa || null, // Mô tả có thể null
                    trangThai: values.trangThai, // Trạng thái môn học
                    ghiChu: values.ghiChu || undefined, // Ghi chú có thể null
                };

                // Gửi yêu cầu thêm môn học qua API
                axios
                    .post('http://localhost:8081/api/monhoc/them-monhoc', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(() => {
                        message.success('Thêm môn học thành công');
                        onSubmit(formattedValues); // Callback để cập nhật danh sách môn học
                        form.resetFields(); // Reset form sau khi thêm thành công
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
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Trạng Thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
                        <Select.Option value="Tạm Ngưng">Tạm Ngưng</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ghiChu"
                    label="Ghi Chú"
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemMonHocModal;
