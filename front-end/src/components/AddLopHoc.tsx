import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message, Row, Col } from 'antd';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';

const AddLopHocModal: React.FC = () => {
    const [formLopHoc] = Form.useForm();
    const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string }[]>([]);
    const [nhanVienList, setNhanVienList] = useState<{ maNhanVien: string, tenNhanVien: string }[]>([]);
    const [caHocList, setCaHocList] = useState<{ maCaHoc: string, batDau: string, ketThuc: string }[]>([]);
    const [phongHocList, setPhongHocList] = useState<{ maPhong: string, soLuong: number }[]>([]);

    useEffect(() => {
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

        axios
            .get('http://localhost:8081/api/cahoc', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setCaHocList(response.data);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách ca học: ' + error.message);
            });

        axios
            .get('http://localhost:8081/api/phonghoc/ds-phong', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setPhongHocList(response.data);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách phòng học: ' + error.message);
            });
    }, []);

    return (
        <Form form={formLopHoc} layout="vertical">
            <Form.Item
                name="maMonHoc"
                label="Môn Học"
                rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
            >
                <Select placeholder="Chọn Môn Học">
                    {monHocList.map((monHoc) => (
                        <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                            {monHoc.maMonHoc} - {monHoc.tenMonHoc}
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
                            {nhanVien.maNhanVien} - {nhanVien.tenNhanVien}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="ngayBatDau"
                        label="Ngày Bắt Đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="soLuong"
                        label="Số Buổi Học"
                        initialValue={30}
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="trangThai"
                label="Tình Trạng"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
            >
                <Select defaultValue="Chưa mở đăng ký">
                    <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
                    <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi Chú">
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
    );
};

export default AddLopHocModal;
