import React, { useEffect, useState } from 'react';
import { Table, Layout, message, InputNumber, Button, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DsLopHocType } from '../types/DsHocVienLopHocType';
import { LeftCircleOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/TableCustom.css';

const { Search } = Input;

const NhapDiem: React.FC = () => {
    const { maLopHoc } = useParams<{ maLopHoc: string }>();
    const navigate = useNavigate();
    const [hocVienList, setHocVienList] = useState<DsLopHocType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8081/api/lophoc/ds-hocvien', {
                    params: { maLopHoc },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setHocVienList(response.data);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách học viên');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [maLopHoc]);

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:8081/api/lophoc/nhapdiem/${maLopHoc}`, hocVienList, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Lưu điểm thành công');
        } catch (error) {
            message.error('Lỗi khi lưu điểm');
        }
    };

    const columns = [
        {
            title: 'Mã Học Viên',
            dataIndex: 'maHocVien',
            key: 'maHocVien',
        },
        {
            title: 'Điểm Thường Kỳ',
            dataIndex: 'diemThuongKy',
            key: 'diemThuongKy',
            render: (value: number, record: DsLopHocType) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value}
                    onChange={(newValue) => {
                        const newList = hocVienList.map((hv) =>
                            hv.maHocVien === record.maHocVien ? { ...hv, diemThuongKy: newValue } : hv
                        );
                        setHocVienList(newList);
                    }}
                />
            ),
        },
        {
            title: 'Điểm Giữa Kỳ',
            dataIndex: 'diemGiuaKy',
            key: 'diemGiuaKy',
            render: (value: number, record: DsLopHocType) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value}
                    onChange={(newValue) => {
                        const newList = hocVienList.map((hv) =>
                            hv.maHocVien === record.maHocVien ? { ...hv, diemGiuaKy: newValue } : hv
                        );
                        setHocVienList(newList);
                    }}
                />
            ),
        },
        {
            title: 'Điểm Cuối Kỳ',
            dataIndex: 'diemCuoiKy',
            key: 'diemCuoiKy',
            render: (value: number, record: DsLopHocType) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value}
                    onChange={(newValue) => {
                        const newList = hocVienList.map((hv) =>
                            hv.maHocVien === record.maHocVien ? { ...hv, diemCuoiKy: newValue } : hv
                        );
                        setHocVienList(newList);
                    }}
                />
            ),
        },
    ];

    // Lọc danh sách học viên để chỉ hiển thị học viên có mã lớp học trùng với `maLopHoc` và khớp với từ khóa tìm kiếm
    const filteredHocVienList = hocVienList.filter(
        (hv) => hv.maLopHoc === maLopHoc && hv.maHocVien.includes(searchText)
    );

    return (
        <Layout>
            <div className="button-container1">
                <Button
                    icon={<LeftCircleOutlined />}
                    onClick={() => navigate(-1)}
                    className="custom-button"
                    style={{ marginBottom: '10px' }}
                >
                    Quay lại
                </Button>
            </div>
            <h1 className="page-name1">NHẬP ĐIỂM CHO LỚP: {maLopHoc}</h1>
            <div className="ds-layout">
                <div className="button-container">
                    <Search
                        className="custom-search"
                        placeholder="Tìm kiếm mã học viên"
                        onSearch={(value) => setSearchText(value)}
                        enterButton={<SearchOutlined />}
                    />
                    <div className="button-container">
                        <Button className="custom-button">Xuất Excel</Button>
                        <Button type="primary" className="custom-button" onClick={handleSave}>
                            Lưu điểm
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredHocVienList}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    rowKey="maHocVien"
                    style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
                    components={{
                        header: {
                            cell: (props: any) => (
                                <th {...props} style={{ backgroundColor: '#f0f0f0' }} />
                            ),
                        },
                    }}
                />
            </div>
        </Layout>
    );
};

export default NhapDiem;
