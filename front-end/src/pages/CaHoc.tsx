import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemCaHocModal from '../components/ThemCaHocModal'; 
import SuaCaHocModal from '../components/SuaCaHocModal'; 
import { CaHocType } from '../types/CaHocType';
import '../styles/TableCustom.css';
import axios from 'axios';

const { Search } = Input;

const CaHoc: React.FC = () => {
    const [searchText, setSearchText] = useState(''); 
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isThemCaModalVisible, setIsThemCaModalVisible] = useState(false); 
    const [selectedRecord, setSelectedRecord] = useState<CaHocType | null>(null);
    const [data, setData] = useState<CaHocType[]>([]); // Dữ liệu ca học từ API
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu

    useEffect(() => {
        const fetchCaHoc = async () => {
            setLoading(true); // Bật trạng thái loading khi fetch dữ liệu
            try {
                const response = await axios.get('http://localhost:8081/api/cahoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
                    },
                });
                setData(response.data); // Lưu dữ liệu ca học vào state
            } catch (error) {
                console.error('Lỗi khi lấy danh sách ca học:', error);
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchCaHoc();
    }, []);

    const handleMenuClick = (e: any, record: CaHocType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditSubmit = (values: any) => {
        console.log('Cập nhật thông tin ca học:', values);
        setIsEditModalVisible(false);
    };

    const handleAddCaHoc = (values: any) => {
        console.log('Thêm ca học mới:', values);
        setIsThemCaModalVisible(false);
    };

    const handleAddCancel = () => {
        setIsThemCaModalVisible(false);
    };

    const soGio = (batDau: string, ketThuc: string): number => {
        const start = new Date(`1970-01-01T${batDau}:00`);
        const end = new Date(`1970-01-01T${ketThuc}:00`);
        const diffMs = end.getTime() - start.getTime();
        return diffMs / (1000 * 60 * 60); 
    };

    const onSearch = (value: string) => {
        setSearchText(value);
    };

    const filteredData = data.filter((record) =>
        record.maCa.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Mã ca học',
            dataIndex: 'maCa',
            key: 'maCa',
            width: '10%',
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'batDau',
            key: 'batDau',
        },
        {
            title: 'Kết thúc',
            dataIndex: 'ketThuc',
            key: 'ketThuc',
        },
        {
            title: 'Số giờ',
            key: 'soGio',
            render: (_: any, record: CaHocType) => (
                <span>{soGio(record.batDau, record.ketThuc)} giờ</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (trangThai: string): JSX.Element => {
                let color = '';
                if (trangThai === 'Đang Hoạt Động') {
                    color = 'geekblue';
                } else if (trangThai === 'Ngưng Hoạt Động') 
                    color = 'green';
                return (
                    <Tag color={color} key={trangThai}>
                        {trangThai.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Quản lý',
            key: 'action',
            width: '8%',
            render: (_: any, record: CaHocType) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="edit" icon={<EditOutlined />}>Xem và sửa thông tin</Menu.Item>
                        <Menu.Item key="delete" icon={<DeleteOutlined />}>Xóa</Menu.Item>
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
            <h1 className='page-name'>QUẢN LÝ CA HỌC</h1>
            <div className="button-container">
                <Search
                    className="custom-search"
                    placeholder="Nhập mã ca học"
                    onSearch={onSearch}
                    enterButton
                    style={{ backgroundColor: '#fff' }} 
                />
                <div className="button-container">
                    <Button className='custom-button'>Hoàn tác</Button>
                    <Button className='custom-button' onClick={() => setIsThemCaModalVisible(true)}>
                        Thêm
                    </Button>
                    <Button className='custom-button'>
                        Nhập Excel
                    </Button>
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredData.length ? filteredData : data} // Gán dữ liệu từ API
                pagination={{ pageSize: 5 }}
                loading={loading} // Hiển thị trạng thái loading khi đang fetch dữ liệu
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <ThemCaHocModal
                visible={isThemCaModalVisible}
                onCancel={handleAddCancel}
                onSubmit={handleAddCaHoc}
            />

            <SuaCaHocModal
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                onSubmit={handleEditSubmit}
                initialValues={selectedRecord}
            />
        </Layout>
    );
};

export default CaHoc;
