import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';

interface ThemLopHocModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: LopHocType[]) => void;
}

const ThemLopHocModal: React.FC<ThemLopHocModalProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string }[]>([]);
    const [nhanVienList, setNhanVienList] = useState<{ maNhanVien: string, tenNhanVien: string }[]>([]);

    useEffect(() => {
        if (visible) {
            axios
                .get('http://localhost:8081/api/monhoc/ds-monhoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    setMonHocList(response.data);
                })
                .catch((error) => {
                    message.error('Lỗi khi lấy danh sách môn học: ' + error.message);
                });

            axios
                .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    const giangVienData = response.data.filter((nhanVien: any) => nhanVien.chucVu === 'Giảng Viên');
                    setNhanVienList(giangVienData);
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
                    maMonHoc: values.maMonHoc, // Dùng maMonHoc để gửi dữ liệu
                    maNhanVien: values.maNhanVien, // Dùng maNhanVien để gửi dữ liệu
                    ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : null,
                    soLuong: values.soLuong,
                    trangThai: values.trangThai,
                    ghiChu: values.ghiChu || undefined,
                };

                axios
                    .post('http://localhost:8081/api/lophoc/them-lophoc', { lopHocs: [formattedValues] }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        message.success(`${response.data.message}`);
                        onSubmit(response.data.ds_LopHoc);
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
                    label="Môn Học"
                    rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                >
                    <Select placeholder="Chọn Môn Học">
                        {monHocList.map((monHoc) => (
                            <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                                {monHoc.tenMonHoc}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="maNhanVien"
                    label="Giảng Viên"
                    rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
                >
                    <Select placeholder="Chọn Giảng Viên">
                        {nhanVienList.map((nhanVien) => (
                            <Select.Option key={nhanVien.maNhanVien} value={nhanVien.maNhanVien}>
                                {nhanVien.tenNhanVien}
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
                        <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
                        <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
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
