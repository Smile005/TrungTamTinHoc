import React from 'react';
import { Modal, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import moment from 'moment';

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
                const formattedValues = {
                    ...values,
                    gioBatDau: values.gioBatDau ? values.gioBatDau.format('HH:mm') : null,  // Format giờ bắt đầu thành chuỗi
                    gioKetThuc: values.gioKetThuc ? values.gioKetThuc.format('HH:mm') : null, // Format giờ kết thúc thành chuỗi
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
                    rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="tenMonHoc"
                    label="Tên Môn Học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="soBuoiHoc"
                    label="Số Buổi Học"
                    rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="hocPhi"
                    label="Học Phí"
                    rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="moTa"
                    label="Mô Tả">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="gioBatDau"
                    label="Giờ Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="gioKetThuc"
                    label="Giờ Kết Thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}>
                    <TimePicker format="HH:mm" />
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
                <Form.Item
                    name="ghiChu"
                    label="Ghi Chú">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemMonHocModal;
