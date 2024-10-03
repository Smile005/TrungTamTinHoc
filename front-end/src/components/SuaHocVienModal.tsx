import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { HocVienType } from '../types/HocVienType';

interface SuaHocVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: HocVienType) => void;
    initialValues: HocVienType;
}

const SuaHocVienModal: React.FC<SuaHocVienModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    // Khi modal mở, thiết lập giá trị ban đầu cho form
    React.useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                ...initialValues,
                ngaySinh: initialValues.ngaySinh ? moment(initialValues.ngaySinh, 'YYYY-MM-DD') : null,
            });
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: HocVienType = {
                    ...values,
                    ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null, // Định dạng ngày sinh
                };

                axios
                    .post('http://localhost:8081/api/hocvien/sua-hocvien', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(() => {
                        message.success('Cập nhật học viên thành công');
                        onOk(formattedValues); 
                        form.resetFields(); 
                    })
                    .catch((error) => {
                        message.error('Lỗi khi cập nhật học viên: ' + error.message);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Chỉnh sửa học viên"
            visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields(); 
                onCancel(); 
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Mã học viên"
                    name="maHocVien"
                    rules={[{ required: true, message: 'Vui lòng nhập mã học viên!' }]}
                >
                    <Input disabled /> 
                </Form.Item>
                <Form.Item
                    label="Họ và tên"
                    name="tenHocVien"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Giới tính"
                    name="gioiTinh"
                >
                    <Radio.Group>
                        <Radio value="Nam">Nam</Radio>
                        <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Ngày sinh"
                    name="ngaySinh"
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="sdt"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="diaChi"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tình trạng"
                    name="tinhTrang"
                    rules={[{ required: true, message: 'Vui lòng nhập tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Đang Học">Đang Học</Select.Option>
                        <Select.Option value="Đã Tốt Nghiệp">Đã Tốt Nghiệp</Select.Option>
                        <Select.Option value="Chưa Đăng Ký">Chưa Đăng Ký</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ghi chú"
                    name="ghiChu"
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SuaHocVienModal;
