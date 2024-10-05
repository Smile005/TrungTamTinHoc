import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';

interface ThemLopHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: LopHocType) => void;
}

const ThemLopHocModal: React.FC<ThemLopHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [maMonHocList, setMaMonHocList] = useState<string[]>([]); 
    const [maNhanVienList, setMaNhanVienList] = useState<string[]>([]); 

    useEffect(() => {
        if (visible) {
            axios
                .get('http://localhost:8081/api/monhoc/ds-monhoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    const maMonHocData = response.data.map((monHoc: any) => monHoc.maMonHoc); 
                    setMaMonHocList(maMonHocData); 
                })
                .catch((error) => {
                    message.error('Lỗi khi lấy danh sách mã môn học: ' + error.message);
                });

            axios
                .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    const giangVienData = response.data
                        .filter((nhanVien: any) => nhanVien.chucVu === "Giảng Viên") 
                        .map((nhanVien: any) => nhanVien.maNhanVien); 
                    setMaNhanVienList(giangVienData);
                })
                .catch((error) => {
                    message.error('Lỗi khi lấy danh sách giảng viên: ' + error.message);
                });
        }
    }, [visible]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formattedValues: Omit<LopHocType, 'key' | 'maLopHoc'> = {
                    tenLopHoc: values.tenLopHoc,
                    maMonHoc: values.maMonHoc,
                    maNhanVien: values.maNhanVien, 
                    ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : null,
                    soLuong: values.soLuong,
                    trangThai: values.trangThai,
                    ghiChu: values.ghiChu || undefined,
                };

                axios
                    .post('http://localhost:8081/api/lophoc/them-lophoc', formattedValues, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        message.success('Thêm lớp học thành công');
                        onSubmit(response.data); 
                        form.resetFields();
                        onCancel();
                    })
                    .catch((error) => {
                        message.error('Lỗi khi thêm lớp học: ' + error.message);
                    });
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
                    name="tenLopHoc"
                    label="Tên Lớp Học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="maMonHoc"
                    label="Mã Môn Học"
                    rules={[{ required: true, message: 'Vui lòng chọn mã môn học!' }]}
                >
                    <Select placeholder="Chọn Mã Môn Học">
                        {maMonHocList.map((maMonHoc) => (
                            <Select.Option key={maMonHoc} value={maMonHoc}>
                                {maMonHoc}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="maNhanVien"
                    label="Mã Giảng Viên"
                    rules={[{ required: true, message: 'Vui lòng chọn mã giảng viên!' }]}
                >
                    <Select placeholder="Chọn Mã Giảng Viên">
                        {maNhanVienList.map((maNhanVien) => (
                            <Select.Option key={maNhanVien} value={maNhanVien}>
                                {maNhanVien}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ngayBatDau"
                    label="Ngày Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="soLuong"
                    label="Số Lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Đang hoạt động">ĐANG HOẠT ĐỘNG</Select.Option>
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
