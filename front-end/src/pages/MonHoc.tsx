import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MonHocType } from '../types/MonHocType';
import ThemMonHocModal from '../components/ThemMonHocModal';
import SuaMonHocModal from '../components/SuaMonHocModal';
import '../styles/TableCustom.css';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Search } = Input;

const MonHoc: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<MonHocType[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MonHocType | null>(null);
    const [data, setData] = useState<MonHocType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMonHoc = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8081/api/monhoc/ds-monhoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách môn học:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMonHoc();
    }, []);

    const onSearch = (value: string) => {
        const filtered = data.filter((item) =>
            item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
            item.tenMonHoc.toLowerCase().includes(value.toLowerCase()) ||
            item.soBuoiHoc?.toString().includes(value) ||
            item.hocPhi?.toString().includes(value) ||
            item.trangThai?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        setSearchText(value);
    };

    const handleDeleteCourse = async (maMonHoc: string) => {
        try {
            await axios.post(
                'http://localhost:8081/api/monhoc/xoa-monhoc',
                { maMonHoc },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            message.success(`Xóa môn học thành công: ${maMonHoc}`);
            setFilteredData(filteredData.filter((item) => item.maMonHoc !== maMonHoc));
        } catch (error: any) {
            message.error(`Lỗi khi xóa môn học: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleMenuClick = (e: any, record: MonHocType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        } else if (e.key === 'delete') {
            handleDeleteCourse(record.maMonHoc);
        }
    };

    const handleAddCourse = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedRecord(null);
    };

    const handleOk = (values: MonHocType) => {
        setFilteredData((prevData) => [...prevData, values]);
        setIsModalVisible(false);
    };

    const handleEditSubmit = (values: MonHocType) => {
        const updatedData = filteredData.map((item) =>
            item.key === selectedRecord?.key ? { ...selectedRecord, ...values } : item
        );
        setFilteredData(updatedData);
        setIsEditModalVisible(false);
        message.success('Sửa môn học thành công!');
    };

    const handleImportExcel = () => {
        message.info('Chức năng nhập từ Excel!');
    };

    const exportMonHocToExcel = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/monhoc/xuat-monhoc', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                responseType: 'arraybuffer' // Đảm bảo nhận về file dưới dạng buffer
            });

            const workbook = XLSX.read(response.data, { type: 'array' });
            XLSX.writeFile(workbook, 'DanhSachMonHoc.xlsx');
            message.success('Xuất danh sách môn học thành công!');
        } catch (error) {
            console.error('Lỗi khi xuất danh sách môn học:', error);
            message.error('Xuất danh sách môn học không thành công');
        }
    };

    const columns = [
        {
            title: 'Mã Môn Học',
            dataIndex: 'maMonHoc',
            key: 'maMonHoc',
            width: '12%',
        },
        {
            title: 'Tên Môn Học',
            dataIndex: 'tenMonHoc',
            key: 'tenMonHoc',
            width: '20%',
        },
        {
            title: 'Số Buổi Học',
            dataIndex: 'soBuoiHoc',
            key: 'soBuoiHoc',
            width: '10%',
        },
        {
            title: 'Học Phí',
            dataIndex: 'hocPhi',
            key: 'hocPhi',
            width: '10%',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (trangThai: string): JSX.Element => {
                let color = trangThai === 'Đang Giảng Dạy' ? 'geekblue' : 'green';
                return <Tag color={color}>{trangThai}</Tag>;
            },
            width: '10%',
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
            width: '10%',
        },
        {
            title: 'Quản lý',
            key: 'action',
            width: '10%',
            render: (_: any, record: MonHocType) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="edit" icon={<EditOutlined />}>
                            Xem và sửa thông tin
                        </Menu.Item>
                        <Menu.Item key="delete" icon={<DeleteOutlined />}>
                            Xóa
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu}>
                        <Button type="link" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <Layout>
            <h1 className="page-name">QUẢN LÝ MÔN HỌC</h1>
            <div className="button-container">
                <Search
                    className="custom-search"
                    placeholder="Tìm kiếm Môn Học, Số Buổi Học"
                    onSearch={onSearch}
                    enterButton
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <div className="button-container">
                    <Button className="custom-button" onClick={handleAddCourse}>
                        Thêm
                    </Button>
                    <Button className="custom-button" onClick={exportMonHocToExcel}>
                        Xuất Excel
                    </Button>
                    <Button className="custom-button" onClick={handleImportExcel}>
                        Nhập Excel
                    </Button>
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                loading={loading}
                rowKey="maMonHoc"
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <ThemMonHocModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleOk}
            />

            <SuaMonHocModal
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                onSubmit={handleEditSubmit}
                initialValues={selectedRecord}
            />
        </Layout>
    );
};

export default MonHoc;
