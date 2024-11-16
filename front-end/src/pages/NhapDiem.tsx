import React, { useEffect, useState } from 'react';
import { Table, Layout, message, InputNumber, Button, Input, Checkbox } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DsLopHocType } from '../types/DsHocVienLopHocType';
import { LeftCircleOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import * as XLSX from 'xlsx';
import '../styles/TableCustom.css';

const { Search } = Input;

interface HocVienInfo {
    maHocVien: string;
    tenHocVien: string;
}

interface LopHocInfo {
    maLopHoc: string;
    tenLopHoc: string;
}

interface DsLopHocTypeWithUpdates extends DsLopHocType {
    updatedScores?: Partial<Pick<DsLopHocType, 'diemThuongKy' | 'diemGiuaKy' | 'diemCuoiKy'>>;
}

const NhapDiem: React.FC = () => {
    const { maLopHoc } = useParams<{ maLopHoc: string }>();
    const navigate = useNavigate();
    const [hocVienList, setHocVienList] = useState<DsLopHocTypeWithUpdates[]>([]);
    const [originalHocVienList, setOriginalHocVienList] = useState<DsLopHocTypeWithUpdates[]>([]);
    const [hocVienInfoList, setHocVienInfoList] = useState<HocVienInfo[]>([]);
    const [tenLopHoc, settenLopHoc] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());

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
                setOriginalHocVienList(response.data);

                const responseHocVien = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setHocVienInfoList(responseHocVien.data);

                const responseLopHoc = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const lopHoc = responseLopHoc.data.find((lop: LopHocInfo) => lop.maLopHoc === maLopHoc);
                settenLopHoc(lopHoc ? lopHoc.tenLopHoc : '');
            } catch (error) {
                message.error('Lỗi khi lấy dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [maLopHoc]);

    const handleSave = async () => {
        const updatedHocVienList = hocVienList
            .filter((hv) => checkedRows.has(hv.maHocVien))
            .map((hv) => {
                const updatedFields: Partial<DsLopHocTypeWithUpdates> = { maHocVien: hv.maHocVien, ...hv.updatedScores };
                return updatedFields;
            })
            .filter((updatedFields) => Object.keys(updatedFields).length > 1); // Chỉ giữ lại những đối tượng có thay đổi

        if (updatedHocVienList.length === 0) {
            message.warning('Vui lòng chọn ít nhất một hàng để lưu điểm hoặc đảm bảo có sự thay đổi.');
            return;
        }

        try {
            await axios.post(`http://localhost:8081/api/lophoc/nhapdiem/${maLopHoc}`, updatedHocVienList, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Lưu điểm thành công');
            setOriginalHocVienList(hocVienList);
            setCheckedRows(new Set());
        } catch (error) {
            message.error('Lỗi khi lưu điểm');
        }
    };

    const exportDiemToExcel = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/lophoc/xuat-diem-lophoc/${maLopHoc}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
                responseType: 'arraybuffer',
            });

            const workbook = XLSX.read(response.data, { type: 'array' });
            XLSX.writeFile(workbook, `DiemLop_${maLopHoc}.xlsx`);
            message.success(`Xuất danh sách điểm cho lớp ${maLopHoc} thành công!`);
        } catch (error) {
            console.error('Lỗi khi xuất danh sách điểm:', error);
            message.error('Xuất danh sách điểm không thành công');
        }
    };

    const updateHocVienScore = (maHocVien: string, field: keyof DsLopHocType, value: number | null) => {
        setHocVienList((prevList) =>
            prevList.map((hv) => {
                if (hv.maHocVien === maHocVien) {
                    const updatedScores = { ...hv.updatedScores, [field]: value };
                    return { ...hv, [field]: value, updatedScores };
                }
                return hv;
            })
        );
    };

    const handleCheckChange = (maHocVien: string, checked: boolean) => {
        setCheckedRows((prevChecked) => {
            const updatedChecked = new Set(prevChecked);
            if (checked) {
                updatedChecked.add(maHocVien);
            } else {
                updatedChecked.delete(maHocVien);
                const original = originalHocVienList.find(hv => hv.maHocVien === maHocVien);
                if (original) {
                    setHocVienList((prevList) =>
                        prevList.map((hv) =>
                            hv.maHocVien === maHocVien ? { ...original } : hv
                        )
                    );
                }
            }
            return updatedChecked;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allChecked = new Set(hocVienList.map((hv) => hv.maHocVien));
            setCheckedRows(allChecked);
        } else {
            setCheckedRows(new Set());
        }
    };

    const columns = [
        {
            title: (
                <Checkbox
                    checked={checkedRows.size === hocVienList.length && hocVienList.length > 0}
                    indeterminate={checkedRows.size > 0 && checkedRows.size < hocVienList.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ),
            key: 'checkbox',
            render: (_: any, record: DsLopHocTypeWithUpdates) => (
                <Checkbox
                    checked={checkedRows.has(record.maHocVien)}
                    onChange={(e) => handleCheckChange(record.maHocVien, e.target.checked)}
                />
            ),
        },
        {
            title: 'Mã Học Viên',
            dataIndex: 'maHocVien',
            key: 'maHocVien',
        },
        {
            title: 'Tên Học Viên',
            key: 'tenHocVien',
            render: (record: DsLopHocTypeWithUpdates) => {
                const hocVien = hocVienInfoList.find(hv => hv.maHocVien === record.maHocVien);
                return hocVien ? hocVien.tenHocVien : 'N/A';
            },
        },
        {
            title: 'Điểm Thường Kỳ',
            dataIndex: 'diemThuongKy',
            key: 'diemThuongKy',
            render: (value: number | null, record: DsLopHocTypeWithUpdates) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value || 0}
                    onChange={(newValue) => {
                        updateHocVienScore(record.maHocVien, 'diemThuongKy', newValue);
                    }}
                    disabled={!checkedRows.has(record.maHocVien)}
                />
            ),
        },
        {
            title: 'Điểm Giữa Kỳ',
            dataIndex: 'diemGiuaKy',
            key: 'diemGiuaKy',
            render: (value: number | null, record: DsLopHocTypeWithUpdates) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value || 0}
                    onChange={(newValue) => {
                        updateHocVienScore(record.maHocVien, 'diemGiuaKy', newValue);
                    }}
                    disabled={!checkedRows.has(record.maHocVien)}
                />
            ),
        },
        {
            title: 'Điểm Cuối Kỳ',
            dataIndex: 'diemCuoiKy',
            key: 'diemCuoiKy',
            render: (value: number | null, record: DsLopHocTypeWithUpdates) => (
                <InputNumber
                    min={0}
                    max={10}
                    value={value || 0}
                    onChange={(newValue) => {
                        updateHocVienScore(record.maHocVien, 'diemCuoiKy', newValue);
                    }}
                    disabled={!checkedRows.has(record.maHocVien)}
                />
            ),
        },
        {
            title: 'Điểm Trung Bình',
            key: 'diemTrungBinh',
            render: (record: DsLopHocTypeWithUpdates) => {
                const diemThuongKy = record.diemThuongKy ?? 0;
                const diemGiuaKy = record.diemGiuaKy ?? 0;
                const diemCuoiKy = record.diemCuoiKy ?? 0;
                const diemTrungBinh = (diemCuoiKy * 0.5 + diemGiuaKy * 0.3 + diemThuongKy * 0.2).toFixed(2);
                return <span>{diemTrungBinh}</span>;
            },
        }
    ];

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
            <h1 className="page-name1">NHẬP ĐIỂM CHO LỚP: {tenLopHoc || maLopHoc}</h1>
            <div className="ds-layout">
                <div className="button-container">
                    <Search
                        className="custom-search"
                        placeholder="Tìm kiếm mã học viên"
                        onSearch={(value) => setSearchText(value)}
                        enterButton={<SearchOutlined />}
                    />
                    <div className="button-container">
                        <Tooltip title="Thi giữa kì không cần tính điểm để xét tư cách thi. Điểm giữa kì phải lớn hơn 0 mới được xét tư cách thi cuối kì." className='top-tip'>
                            <ExclamationCircleOutlined />
                        </Tooltip>
                        <Button type="primary" className="custom-button" onClick={handleSave}>
                            Lưu điểm
                        </Button>
                        <Button className="custom-button" onClick={exportDiemToExcel}>
                            Xuất Excel
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
