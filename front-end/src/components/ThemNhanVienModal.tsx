import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message } from 'antd';
import axios from 'axios';
import { NhanVienType } from '../types/NhanVienType';

interface ThemNhanVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: NhanVienType) => void;
}

const ThemNhanVienModal: React.FC<ThemNhanVienModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: Omit<NhanVienType, 'maNhanVien'> = {
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

                axios.post('http://localhost:8081/api/nhanvien/them-nhanvien', { nhanViens: [formattedValues] }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                    .then(() => {
                        message.success('Thêm nhân viên thành công');
                        onSubmit(formattedValues as NhanVienType);
                        form.resetFields();
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm nhân viên: ' + error.message);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm Nhân Viên"
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText="Thêm Nhân Viên"
            style={{ top: 10}}
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="tenNhanVien"
                        label="Họ và Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    {/* <Form.Item
                        name="img"
                        label="URL Ảnh"
                    >
                        <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item> */}
                    <Form.Item
                        name="chucVu"
                        label="Chức Vụ"
                    >
                        <Select placeholder="Chọn chức vụ">
                            <Select.Option value="Giảng Viên">Giảng Viên</Select.Option>
                            <Select.Option value="Nhân Viên">Nhân Viên</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="ngayVaoLam"
                        label="Ngày Vào Làm"
                    >
                        <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày vào làm" />
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
                        <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
                    </Form.Item>
                    <Form.Item
                        name="sdt"
                        label="Số Điện Thoại"
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        name="diaChi"
                        label="Địa Chỉ"
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        name="trangThai"
                        label="Trạng Thái"
                        rules={[{ required: true, message: 'Vui lòng chọn!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Select.Option value="Full time">Full time</Select.Option>
                            <Select.Option value="Part time">Part time</Select.Option>
                            <Select.Option value="Thực tập sinh">Thực tập sinh</Select.Option>
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

export default ThemNhanVienModal;
