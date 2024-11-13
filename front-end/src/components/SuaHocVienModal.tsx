import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message, Row, Col } from 'antd';
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

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                ...initialValues,
                ngaySinh: initialValues.ngaySinh ? moment(initialValues.ngaySinh, 'YYYY-MM-DD') : null,
                ngayVaoHoc: initialValues.ngayVaoHoc ? moment(initialValues.ngayVaoHoc, 'YYYY-MM-DD').add(1, 'days') : null,
            });
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: HocVienType = {
                    ...initialValues,
                    tenHocVien: values.tenHocVien,
                    img: values.img || null,
                    ngayVaoHoc: values.ngayVaoHoc ? values.ngayVaoHoc.format('YYYY-MM-DD') : null,
                    ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
                    gioiTinh: values.gioiTinh,
                    sdt: values.sdt || null,
                    email: values.email || null,
                    diaChi: values.diaChi || null,
                    tinhTrang: values.tinhTrang,
                    ghiChu: values.ghiChu || null,
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
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Mã học viên"
                        name="maHocVien"
                    >
                        <Input disabled placeholder="Mã học viên tự động" />
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="tenHocVien"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên học viên" />
                    </Form.Item>
                    {/* <Form.Item
                        label="URL Ảnh"
                        name="img"
                    >
                        <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item> */}
                    <Row gutter={16} className="custom-style">
                        <Col span={12}>
                            <Form.Item
                                name="ngaySinh"
                                label="Ngày Sinh"
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                            >
                                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ngayVaoHoc"
                                label="Ngày Vào Học"
                            >
                                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày vào học" />
                            </Form.Item>
                        </Col>
                    </Row>
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
                        label="Số điện thoại"
                        name="sdt"
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="diaChi"
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        label="Tình trạng"
                        name="tinhTrang"
                        rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                    >
                        <Select placeholder="Chọn tình trạng học viên">
                            <Select.Option value="Đang Học">Đang Học</Select.Option>
                            <Select.Option value="Đã Tốt Nghiệp">Đã Tốt Nghiệp</Select.Option>
                            <Select.Option value="Chưa Đăng Ký">Chưa Đăng Ký</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="ghiChu"
                    >
                        <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default SuaHocVienModal;
