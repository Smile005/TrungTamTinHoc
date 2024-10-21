import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
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
    const [data, setData] = useState<CaHocType[]>([]); 
    const [loading, setLoading] = useState<boolean>(false); 

    useEffect(() => {
        const fetchCaHoc = async () => {
            setLoading(true); 
            try {
                const response = await axios.get('http://localhost:8081/api/cahoc', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, 
                    },
                });
                setData(response.data); 
            } catch (error) {
                console.error('Lỗi khi lấy danh sách ca học:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchCaHoc();
    }, []);

    const handleMenuClick = (e: any, record: CaHocType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        } else if (e.key === 'delete') {
            deleteCaHoc(record.maCa); 
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

    const deleteCaHoc = async (maCa: string | undefined) => {
        if (!maCa) {
            message.error('Không thể xóa ca học: Mã ca học không hợp lệ.');
            return;
        }

        try {
            await axios.post('http://localhost:8081/api/cahoc/xoa-cahoc', 
                { maCa }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const newData = data.filter((item) => item.maCa !== maCa);
            setData(newData);
            message.success('Xóa ca học thành công');
        } catch (error) {
            console.error('Lỗi khi xóa ca học:', error);
            message.error('Lỗi khi xóa ca học');
        }
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
                        {trangThai}
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
                dataSource={filteredData.length ? filteredData : data} 
                pagination={{ pageSize: 5 }}
                loading={loading} 
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
