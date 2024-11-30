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

const ThemBuoiHocModal: React.FC<ThemBuoiHocModalProps> = ({ maLopHoc, visible, onCancel }) => {
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
        const loai = "Thi"; // Thay đổi giá trị loại để thể hiện "Thi"
        try {
            const values = await form.validateFields();
            const token = localStorage.getItem('token');
    
            // Gắn thêm cụm từ "(Thi)" vào trường `ghiChu` hoặc trường khác nếu cần
            const updatedValues = {
                ...values,
                ghiChu: `${values.ghiChu || ''} (Thi)`,
                maLopHoc,
                loai, // Thêm loại "Thi" vào payload
            };
    
            const response = await axios.post(
                'http://localhost:8081/api/lichhoc/createBuoiHoc',
                updatedValues,
                { headers: { Authorization: `Bearer ${token}` } },
            );
    
            if (response.status === 200 || response.status === 201) {
                message.success('Đã được thêm thành công!');
                onCancel();
            } else {
                message.error('Thêm lịch thất bại. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi khi thêm lịch:', error);
            message.error('Không thể thêm lịch. Vui lòng thử lại!');
        }
    };
    

    const handleCheck = async () => {

    }

    return (
        <Modal
            title="Thêm Lịch Thi"
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
                        label="Giáo viên"
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
                        label="Ca học"
                        name="maCa"
                        rules={[{ required: true, message: 'Vui lòng chọn ca học!' }]}
                    >
                        <Select placeholder="Chọn ca học">
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
                        label="Phòng học"
                        name="maPhong"
                        rules={[{ required: true, message: 'Vui lòng chọn phòng học!' }]}
                    >
                        <Select placeholder="Chọn phòng học">
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
                        label="Ngày học"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày học!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày học" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="ghiChu" label="Ghi Chú">
                        <Input.TextArea placeholder="Nhập ghi chú" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ThemBuoiHocModal;
