import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Select, InputNumber, message, Table, Modal } from 'antd';
import axios from 'axios';
import { LichHocType } from '../types/LichHocType';
import { LopHocType } from '../types/LopHocType';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import "../styles/ButtonCustom.css"

const { Option } = Select;

interface ThemLichHocProps {
    maLopHoc: string;
}

const ThemLichHoc: React.FC<ThemLichHocProps> = ({ maLopHoc }) => {
    const [lopHoc, setLopHoc] = useState<LopHocType | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
    const [error, setError] = useState<string | null>(null);
    const [lichHocs, setLichHocs] = useState<LichHocType[]>([]);
    const [caHocList, setCaHocList] = useState<{ maCa: string; batDau: string; ketThuc: string, trangThai: string }[]>([]);
    const [phongHocList, setPhongHocList] = useState<{ maPhong: string; soLuong: number, trangThai: string }[]>([]);

    const [selectedThu, setSelectedThu] = useState<string | undefined>();
    const [selectedCaHoc, setSelectedCaHoc] = useState<string | undefined>();
    const [selectedPhong, setSelectedPhong] = useState<string | undefined>();
    const [selectedSoBuoi, setSelectedSoBuoi] = useState<number | undefined>(10);

    const [totalSoBuoi, setTotalSoBuoi] = useState(0);

    useEffect(() => {
        // Tính tổng số buổi học
        const total = lichHocs.reduce((sum, lopHoc) => sum + (lopHoc.soBuoi || 0), 0);
        setTotalSoBuoi(total);
    }, [lichHocs]);

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
                            setLichHocs([]);
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
                setLichHocs(lichHocResponse?.data || []);
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

    const getDayOfWeek = (thu: number) => {
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return days[thu] || '';
    };

    const columns = [
        { title: 'Mã lịch học', dataIndex: 'maLichHoc', key: 'maLichHoc' },
        { title: 'Thứ', dataIndex: 'thu', key: 'thu', render: (thu: number) => getDayOfWeek(thu) },
        { title: 'Ca học', dataIndex: 'maCa', key: 'maCa' },
        { title: 'Phòng học', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Giảng viên', dataIndex: 'tenGiaoVien', key: 'tenGiaoVien' },
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
            tenGiaoVien: lopHoc?.tenNhanVien,
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

            setLichHocs((prevBuoiHocs) => [...prevBuoiHocs, response.data.lichHoc]);
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

                    setLichHocs(lichHocs.filter(lichHoc => lichHoc.maLichHoc !== maLichHoc));
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

    const checkLickHoc = () => {

    }

    return (
        <div>
            <h2>Thông Tin Lớp Học</h2>
            <div className="custom-info">
                {/* Dòng 1 */}
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <span><b>Mã lớp học:</b> {maLopHoc}</span>
                    </Col>
                    <Col span={8}>
                        <span><b>Tên lớp học:</b> {lopHoc?.tenLopHoc}</span>
                    </Col>
                </Row>
                {/* Dòng 2 */}
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <span><b>Môn học:</b> {lopHoc?.tenMonHoc}</span>
                    </Col>
                    <Col span={8}>
                        <span><b>Giảng viên:</b> {lopHoc?.tenNhanVien}</span>
                    </Col>
                </Row>
                {/* Dòng 3 */}
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <span><b>Số học viên:</b> {lopHoc?.SL_HocVien} / {lopHoc?.soLuongMax}</span>
                    </Col>
                    <Col span={8}>
                        <span><b>Số buổi học:</b> {totalSoBuoi} / {lopHoc?.soBuoiHoc}</span>
                    </Col>
                </Row>
            </div>

            <h3>Thêm Lịch Học</h3>
            <Row gutter={[16, 16]}>
                <Col span={3} style={{ width: '100%' }}>
                    <Select
                        value={selectedThu}
                        placeholder="Chọn thứ"
                        onChange={setSelectedThu}
                        style={{ width: '100%' }}
                    >
                        {daysOfWeek.map(day => (
                            <Option key={day.value} value={day.value}>{day.label}</Option>
                        ))}
                    </Select>
                </Col>

                <Col span={5} style={{ width: '100%' }}>
                    <Select
                        value={selectedCaHoc}
                        placeholder="Chọn ca học"
                        onChange={setSelectedCaHoc}
                        style={{ width: '100%' }}
                    >
                        {caHocList
                            .filter(ca => ca.trangThai !== 'Ngưng Hoạt Động')
                            .map(ca => (
                                <Option key={ca.maCa} value={ca.maCa}>
                                    {ca.maCa}: {ca.batDau} - {ca.ketThuc}
                                </Option>
                            ))}
                    </Select>
                </Col>

                <Col span={5} style={{ width: '100%' }}>
                    <Select
                        value={selectedPhong}
                        placeholder="Chọn phòng học"
                        onChange={setSelectedPhong}
                        style={{ width: '100%' }}
                    >
                        {phongHocList
                            .filter(phong => phong.trangThai !== 'Ngưng hoạt động')
                            .map(phong => (
                                <Option key={phong.maPhong} value={phong.maPhong}>
                                    {phong.maPhong} - {phong.soLuong} chỗ ngồi
                                </Option>
                            ))}
                    </Select>
                </Col>

                <Col span={3} style={{ width: '100%' }}>
                    <InputNumber
                        min={1}
                        max={lopHoc?.soBuoiHoc}
                        value={selectedSoBuoi}
                        onChange={handleSoBuoiChange}
                        placeholder="Số buổi học"
                        style={{ width: '100%' }}
                    />
                </Col>

                <Col span={4} style={{ width: '100%' }}>
                    <Button type="primary" onClick={checkLickHoc} style={{ width: '100%' }}>Kiểm tra</Button>
                </Col>

                <Col span={4} style={{ width: '100%' }}>
                    <Button type="primary" onClick={createLichHoc} style={{ width: '100%' }}>Thêm lịch học</Button>
                </Col>
            </Row>

            <Table dataSource={lichHocs} columns={columns} rowKey="maLichHoc" />
        </div>
    );
};

export default ThemLichHoc;
