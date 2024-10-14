import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message } from 'antd';
import axios from 'axios';
import { NhanVienType } from '../types/NhanVienType';
import moment from 'moment';

interface SuaNhanVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: NhanVienType) => void;
    initialValues: NhanVienType | null;
}

const SuaNhanVienModal: React.FC<SuaNhanVienModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                ...initialValues,
                // Chuyển đổi định dạng ngày và thêm 1 ngày nếu cần
                ngaySinh: initialValues.ngaySinh ? moment(initialValues.ngaySinh, 'YYYY-MM-DD').add(1, 'days') : null,
                ngayVaoLam: initialValues.ngayVaoLam ? moment(initialValues.ngayVaoLam, 'YYYY-MM-DD').add(1, 'days') : null,
            });
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: Omit<NhanVienType, 'maNhanVien'> = {
                    ...initialValues,
                    tenNhanVien: values.tenNhanVien,
                    img: values.img || null,
                    chucVu: values.chucVu || null,
                    ngayVaoLam: values.ngayVaoLam ? values.ngayVaoLam.format('YYYY-MM-DD') : null,
                    gioiTinh: values.gioiTinh,
                    ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
                    sdt: values.sdt || null,
                    email: values.email || null,
                    diaChi: values.diaChi || null,
                    trangThai: values.trangThai || null,
                    ghiChu: values.ghiChu || null,
                };

                axios.post('http://localhost:8081/api/nhanvien/sua-nhanvien', formattedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(() => {
                        message.success('Sửa thông tin nhân viên thành công');
                        onOk(formattedValues as NhanVienType); 
                        form.resetFields();
                    })
                    .catch((error) => {
                        message.error('Lỗi khi sửa thông tin nhân viên: ' + error.message);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Sửa Nhân Viên"
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenNhanVien"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="img"
                    label="URL Ảnh"
                >
                    <Input placeholder="URL hình ảnh" />
                </Form.Item>
                <Form.Item
                    name="chucVu"
                    label="Chức Vụ"
                >
                    <Select>
                        <Select.Option value="Giảng Viên">Giảng Viên</Select.Option>
                        <Select.Option value="Nhân Viên">Nhân Viên</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ngayVaoLam"
                    label="Ngày Vào Làm"
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="gioiTinh"
                    label="Giới Tính"
                >
                    <Radio.Group>
                        <Radio value="Nam">Nam</Radio>
                        <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="ngaySinh"
                    label="Ngày Sinh"
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="sdt"
                    label="Số Điện Thoại"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="diaChi"
                    label="Địa Chỉ"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Trạng Thái"
                    rules={[{ required: true, message: 'Vui lòng chọn!' }]}
                >
                    <Select>
                        <Select.Option value="Full time">Full time</Select.Option>
                        <Select.Option value="Part time">Part time</Select.Option>
                        <Select.Option value="Thực tập sinh">Thực tập sinh</Select.Option>
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

export default SuaNhanVienModal;
