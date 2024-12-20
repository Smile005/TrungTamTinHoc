import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { NhanVienType } from '../types/NhanVienType';
import { CaHocType } from '../types/CaHocType';
import { PhongHocType } from '../types/PhongHocType';

const { Option } = Select;

interface ThemBuoiHocModalProps {
    maLopHoc: string;
    visible: boolean;
    onCancel: () => void;
}

const ThemLichThiModal: React.FC<ThemBuoiHocModalProps> = ({ maLopHoc, visible, onCancel }) => {
    const [form] = Form.useForm();
    const [giangViens, setGiangViens] = useState<NhanVienType[]>([]);
    const [caHocs, setCaHocs] = useState<CaHocType[]>([]);
    const [phongHocs, setPhongHocs] = useState<PhongHocType[]>([]);

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    useEffect(() => {
        const fetchLopHocData = async () => {
            if (!maLopHoc) return;

            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Bạn chưa đăng nhập!');
                return;
            }

            try {
                const [giaoVienResponse, caHocResponse, phongHocResponse] = await Promise.all([
                    axios.get('http://localhost:8081/api/nhanVien/ds-giangvien', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8081/api/cahoc', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8081/api/phonghoc/ds-phong', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setGiangViens(giaoVienResponse?.data || []);
                setCaHocs(caHocResponse?.data || []);
                setPhongHocs(phongHocResponse?.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                message.error('Không thể tải dữ liệu. Vui lòng thử lại sau!');
            }
        };

        fetchLopHocData();
    }, [maLopHoc]);

    const handleOk = async () => {
        const loai = "Ngày thi";
        try {
            const values = await form.validateFields();
            const token = localStorage.getItem('token');
            console.log(values)
            
            //Vị trí

            const response = await axios.post(
                'http://localhost:8081/api/lichhoc/createLichThi',
                { ...values, maLopHoc, loai },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (response.status === 200 || response.status === 201) {
                message.success('Buổi học đã được thêm thành công!');
                onCancel();
            } else {
                message.error('Thêm buổi học thất bại. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi khi thêm buổi học:', error);
            message.error('Không thể thêm buổi học. Vui lòng thử lại!');
        }
    };

    const handleCheck = async () => {

    }

    return (
        <Modal
            title="Thêm Buổi Thi"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={[
                <Button
                    key="cancel"
                    onClick={() => {
                        form.resetFields();
                        onCancel();
                    }}
                >
                    Hủy
                </Button>,
                <Button key="check" type="primary" onClick={handleCheck}>
                    Kiểm tra
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Thêm
                </Button>,
            ]}
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Lớp học" name="maLopHoc" initialValue={maLopHoc}>
                        <Input placeholder="Mã lớp học" disabled />
                    </Form.Item>

                    <Form.Item
                        label="Giảng viên"
                        name="maNhanVien"
                        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
                    >
                        <Select placeholder="Chọn giảng viên">
                            {giangViens
                                .filter((giangVien) => giangVien.trangThai !== 'Đã Nghỉ')
                                .map((giangVien) => (
                                    <Option key={giangVien.maNhanVien} value={giangVien.maNhanVien}>
                                        {giangVien.maNhanVien} - {giangVien.tenNhanVien}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ca thi"
                        name="maCa"
                        rules={[{ required: true, message: 'Vui lòng chọn ca thi!' }]}
                    >
                        <Select placeholder="Chọn ca thi">
                            {caHocs
                                .filter((caHoc) => caHoc.trangThai === 'Đang Hoạt Động')
                                .map((caHoc) => (
                                    <Option key={caHoc.maCa} value={caHoc.maCa}>
                                        {caHoc.maCa}: {caHoc.batDau} - {caHoc.ketThuc}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phòng thi"
                        name="maPhong"
                        rules={[{ required: true, message: 'Vui lòng chọn phòng thi!' }]}
                    >
                        <Select placeholder="Chọn phòng thi">
                            {phongHocs
                                .filter((phongHoc) => phongHoc.trangThai === 'Đang Hoạt Động')
                                .map((phongHoc) => (
                                    <Option key={phongHoc.maPhong} value={phongHoc.maPhong}>
                                        {phongHoc.maPhong} - {phongHoc.soLuong} chỗ ngồi
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ngayHoc"
                        label="Ngày thi"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày thi!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày thi" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="ghiChu" label="Ghi Chú">
                        <Input.TextArea placeholder="Nhập ghi chú" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ThemLichThiModal;
