import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Select, InputNumber, message, Table, Modal } from 'antd';
import axios from 'axios';
import { LichHocType } from '../types/LichHocType';
import { LopHocType } from '../types/LopHocType';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ThemLichHocProps {
    maLopHoc: string;
}

const ThemLichHoc: React.FC<ThemLichHocProps> = ({ maLopHoc }) => {
    const [lopHoc, setLopHoc] = useState<LopHocType | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
    const [error, setError] = useState<string | null>(null);
    const [buoiHocs, setBuoiHocs] = useState<LichHocType[]>([]);
    const [caHocList, setCaHocList] = useState<{ maCa: string; batDau: string; ketThuc: string }[]>([]);
    const [phongHocList, setPhongHocList] = useState<{ maPhong: string; soLuong: number }[]>([]);

    const [selectedThu, setSelectedThu] = useState<string | undefined>();
    const [selectedCaHoc, setSelectedCaHoc] = useState<string | undefined>();
    const [selectedPhong, setSelectedPhong] = useState<string | undefined>();
    const [selectedSoBuoi, setSelectedSoBuoi] = useState<number | undefined>(10);

    useEffect(() => {
        const fetchLopHocData = async () => {
            if (!maLopHoc) return;

            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const [
                    lopHocResponse,
                    lichHocResponse,
                    caHocResponse,
                    phongHocResponse,
                ] = await Promise.all([
                    axios.get(`http://localhost:8081/api/lophoc/lophocByMa/${maLopHoc}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`http://localhost:8081/api/lichhoc/getLichHocByMaLop/${maLopHoc}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).catch((error) => {
                        if (error.response && error.response.status === 404) {
                            setBuoiHocs([]);
                        }
                    }),
                    axios.get('http://localhost:8081/api/cahoc', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8081/api/phonghoc/ds-phong', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setLopHoc(lopHocResponse.data || null);
                setBuoiHocs(lichHocResponse?.data || []);
                setCaHocList(caHocResponse.data || []);
                setPhongHocList(phongHocResponse.data || []);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchLopHocData();
    }, [maLopHoc]);

    if (!maLopHoc) return <div>Vui lòng cung cấp mã lớp học hợp lệ.</div>;
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    // Hàm để chuyển đổi số thu thành tên ngày trong tuần
    const getDayOfWeek = (thu: number) => {
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return days[thu] || '';
    };

    const columns = [
        { title: 'Mã lịch học', dataIndex: 'maLichHoc', key: 'maLichHoc' },
        { title: 'Thứ', dataIndex: 'thu', key: 'thu', render: (thu: number) => getDayOfWeek(thu) },
        { title: 'Ca học', dataIndex: 'maCa', key: 'maCa' },
        { title: 'Phòng học', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Giáo viên', dataIndex: 'tenGiaoVien', key: 'tenGiaoVien' },
        { title: 'Số buổi học', dataIndex: 'soBuoi', key: 'soBuoi' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: any) => (
                <span style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        icon={<EditOutlined style={{ color: 'blue' }} />}
                        onClick={() => handleEdit(record)}
                        type="text"
                    />
                    <Button
                        icon={<DeleteOutlined style={{ color: 'blue' }} />}
                        onClick={() => handleDelete(record.maLichHoc)}
                        type="text"
                    />
                </span>
            ),
        },
    ];

    const createLichHoc = async () => {
        if (!selectedThu || !selectedCaHoc || !selectedPhong || !selectedSoBuoi || selectedSoBuoi <= 0) {
            message.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const lichHocData = {
            maLopHoc,
            thu: parseInt(selectedThu),
            maCa: selectedCaHoc,
            maGiaoVien: lopHoc?.maNhanVien,
            maPhong: selectedPhong,
            soBuoi: selectedSoBuoi,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8081/api/lichhoc/createLichHoc', lichHocData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setBuoiHocs((prevBuoiHocs) => [...prevBuoiHocs, response.data.lichHoc]);
            message.success('Lịch học đã được tạo thành công!');
            resetForm();
        } catch (error: any) {
            console.error('Lỗi khi tạo lịch học:', error);
            message.error('Không thể tạo lịch học.');
        }
    };

    const handleEdit = async (record: LichHocType) => {
        console.log('Editing record:', record);
    };

    const handleDelete = (maLichHoc: string) => {
        // Hiển thị modal xác nhận trước khi xóa
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa lịch học này?',
            content: 'Khi xóa, lịch học sẽ không thể phục hồi.',
            cancelText: 'Hủy',
            okText: 'Xóa',
            style: { bottom: '10px' },
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:8081/api/lichhoc/deleteLichHoc/${maLichHoc}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setBuoiHocs(buoiHocs.filter(buoiHoc => buoiHoc.maLichHoc !== maLichHoc));
                    message.success('Xóa lịch học thành công!');
                } catch (error) {
                    console.error('Lỗi khi xóa lịch học:', error);
                    message.error('Không thể xóa lịch học.');
                }
            },
        });
    };

    const resetForm = () => {
        setSelectedThu(undefined);
        setSelectedCaHoc(undefined);
        setSelectedPhong(undefined);
        setSelectedSoBuoi(10);
    };

    const handleSoBuoiChange = (value: number | null) => {
        setSelectedSoBuoi(value ?? undefined);
    };

    const daysOfWeek = [
        { label: 'Thứ 2', value: '1' },
        { label: 'Thứ 3', value: '2' },
        { label: 'Thứ 4', value: '3' },
        { label: 'Thứ 5', value: '4' },
        { label: 'Thứ 6', value: '5' },
        { label: 'Thứ 7', value: '6' },
        { label: 'Chủ Nhật', value: '0' },
    ];

    return (
        <div>
            <h2>Thông Tin Lớp Học</h2>
            <Row>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <p><strong>Mã lớp học:</strong> {maLopHoc}</p>
                    <p><strong>Tên lớp học:</strong> {lopHoc?.tenLopHoc}</p>
                </div>
            </Row>
            <Row>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <p><strong>Môn học:</strong> {lopHoc?.tenMonHoc}</p>
                    <p><strong>Giảng viên:</strong> {lopHoc?.tenNhanVien}</p>
                </div>
            </Row>
            <Row>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <p><strong>Số học viên:</strong> 0 / {lopHoc?.soLuongMax}</p>
                    <p><strong>Số buổi học:</strong> 0 / {lopHoc?.soBuoiHoc}</p>
                </div>
            </Row>

            <h3>Thêm Lịch Học</h3>
            <Row gutter={16}>
                <Col>
                    <Select value={selectedThu} placeholder="Chọn thứ" onChange={setSelectedThu} style={{ width: 100 }}>
                        {daysOfWeek.map(day => (
                            <Option key={day.value} value={day.value}>{day.label}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Select value={selectedCaHoc} placeholder="Chọn ca học" onChange={setSelectedCaHoc} style={{ width: 120 }}>
                        {caHocList.map(ca => (
                            <Option key={ca.maCa} value={ca.maCa}>{ca.batDau} - {ca.ketThuc}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Select value={selectedPhong} placeholder="Chọn phòng học" onChange={setSelectedPhong} style={{ width: 150 }}>
                        {phongHocList.map(phong => (
                            <Option key={phong.maPhong} value={phong.maPhong}>{phong.maPhong}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <InputNumber
                        min={1}
                        max={lopHoc?.soBuoiHoc}
                        value={selectedSoBuoi}
                        onChange={handleSoBuoiChange}
                        placeholder="Số buổi học"
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={createLichHoc}>Thêm lịch học</Button>
                </Col>
            </Row>

            <Table dataSource={buoiHocs} columns={columns} rowKey="maLichHoc" />
        </div>
    );
};

export default ThemLichHoc;
