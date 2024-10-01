import React from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import moment from 'moment';

interface ThemLopHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const ThemLopHocModal: React.FC<ThemLopHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues = {
                    ...values,
                    ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('DD/MM/YYYY') : null, // Format ngày bắt đầu thành DD/MM/YYYY
                };
                onSubmit(formattedValues); 
                form.resetFields(); 
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm Lớp Học"
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maLopHoc"
                    label="Mã Lớp Học"
                    rules={[{ required: true, message: 'Vui lòng nhập mã lớp học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="tenLopHoc"
                    label="Tên Lớp Học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="maMonHoc"
                    label="Mã Môn Học"
                    rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="maGiangVien"
                    label="Mã Giảng Viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="ngayBatDau"
                    label="Ngày Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="soLuong"
                    label="Số Lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}>
                    <Select>
                        <Select.Option value="Hoạt động">ĐANG HOẠT ĐỘNG</Select.Option>
                        <Select.Option value="Ngưng hoạt động">NGƯNG HOẠT ĐỘNG</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="ghiChu" label="Ghi Chú">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemLopHocModal;
