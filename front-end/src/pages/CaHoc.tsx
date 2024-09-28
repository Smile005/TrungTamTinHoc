import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { CaHocType } from '../types/CaHocType';
import '../styles/TableCustom.css';

const { Search } = Input;

const CaHoc: React.FC = () => {
    const [searchText, setSearchText] = useState(''); // State to track search input
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CaHocType | null>(null);

    const handleMenuClick = (e: any, record: CaHocType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        }
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleOk = (values: any) => {
        console.log('Cập nhật thông tin ca học:', values);
        setIsEditModalVisible(false);
    };

    const soGio = (batDau: string, ketThuc: string): number => {
        const start = new Date(`1970-01-01T${batDau}:00`);
        const end = new Date(`1970-01-01T${ketThuc}:00`);
        const diffMs = end.getTime() - start.getTime();
        return diffMs / (1000 * 60 * 60); // Convert to hours
    };

    const onSearch = (value: string) => {
        setSearchText(value);
    };

    // Filtering the data based on search input (filtering by 'maCa')
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
                let color = trangThai === 'Đang hoạt động' ? 'geekblue' : 'green';
                return <Tag color={color} key={trangThai}>{trangThai.toUpperCase()}</Tag>;
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
                        <Menu.Item key="edit">Xem thông tin</Menu.Item>
                        <Menu.Item key="dangKy">Đăng ký</Menu.Item>
                        <Menu.Item key="tinhTrang">Đổi tình trạng</Menu.Item>
                        <Menu.Item key="delete">Xóa</Menu.Item>
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
                    style={{ backgroundColor: '#fff' }} // Changing button color to white
                />
                <div className="button-container">
                    <Button className='custom-button'>Hoàn tác</Button>
                    <Button className='custom-button'>Thêm</Button>
                    <Button className='custom-button' >
                        Nhập Excel
                    </Button> {/* Thêm sự kiện onClick */}
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredData} // Use filtered data for table rendering
                pagination={{ pageSize: 5 }}
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />
        </Layout>
    );
};

export default CaHoc;

// Dữ liệu mẫu cho bảng
const data: CaHocType[] = [
    {
        key: '1',
        maCa: 'CA001',
        batDau: '08:00',
        ketThuc: '10:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '2',
        maCa: 'CA002',
        batDau: '10:30',
        ketThuc: '12:30',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '3',
        maCa: 'CA003',
        batDau: '13:00',
        ketThuc: '15:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '4',
        maCa: 'CA004',
        batDau: '15:30',
        ketThuc: '17:30',
        trangThai: 'Ngưng hoạt động',
        ghiChu: 'Buổi học tiếp theo',
    },
    {
        key: '5',
        maCa: 'CA005',
        batDau: '18:00',
        ketThuc: '20:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '6',
        maCa: 'CA006',
        batDau: '07:00',
        ketThuc: '09:00',
        trangThai: 'Đang hoạt động',
        ghiChu: 'Buổi sáng',
    },
    {
        key: '7',
        maCa: 'CA007',
        batDau: '09:30',
        ketThuc: '11:30',
        trangThai: 'Ngưng hoạt động',
        ghiChu: '',
    },
    {
        key: '8',
        maCa: 'CA008',
        batDau: '14:00',
        ketThuc: '16:00',
        trangThai: 'Đang hoạt động',
        ghiChu: 'Buổi chiều',
    },
    {
        key: '9',
        maCa: 'CA009',
        batDau: '16:30',
        ketThuc: '18:30',
        trangThai: 'Ngưng hoạt động',
        ghiChu: '',
    },
    {
        key: '10',
        maCa: 'CA010',
        batDau: '08:00',
        ketThuc: '10:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '11',
        maCa: 'CA011',
        batDau: '10:30',
        ketThuc: '12:30',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '12',
        maCa: 'CA012',
        batDau: '13:00',
        ketThuc: '15:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '13',
        maCa: 'CA013',
        batDau: '15:30',
        ketThuc: '17:30',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '14',
        maCa: 'CA014',
        batDau: '18:00',
        ketThuc: '20:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
    {
        key: '15',
        maCa: 'CA015',
        batDau: '08:00',
        ketThuc: '10:00',
        trangThai: 'Đang hoạt động',
        ghiChu: '',
    },
];
