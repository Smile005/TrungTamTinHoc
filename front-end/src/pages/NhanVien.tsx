import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, TableColumnsType, Input, GetProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
// import { NhanVienType } from '../types/NhanVienType';
import { NhanVienType } from '../types/NhanVienType';
import NhanVienModal01 from '../components/NhanVienModal01';
import '../styles/TableCustom.css';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const NhanVien: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<NhanVienType | null>(null);

    // Hàm xử lý khi chọn menu
    const handleMenuClick = (e: any, record: NhanVienType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);  // Lưu lại thông tin nhân viên được chọn
            setIsModalVisible(true); // Hiển thị modal khi chọn chức năng "Chỉnh sửa"
        }
    };

    // Đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    };

    // Hàm xử lý khi submit form chỉnh sửa
    const handleOk = (values: any) => {
        console.log('Cập nhật thông tin nhân viên:', values);
        // Thực hiện cập nhật thông tin nhân viên ở đây
        setIsModalVisible(false);
    };

    const columns: TableColumnsType<NhanVienType> = [
        {
            title: 'Mã nhân viên',
            dataIndex: 'maNhanVien',
            key: 'maNhanVien',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'tenNhanVien',
            key: 'tenNhanVien',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            filters: [
                { text: 'Nam', value: 'Nam' },
                { text: 'Nữ', value: 'Nữ' },
            ],
            onFilter: (value, record) => record.gioiTinh?.indexOf(value as string) === 0,
            render: (gioiTinh: string): JSX.Element => {
                let color = '';
                if (gioiTinh === 'Nam') {
                    color = 'geekblue';
                } else if (gioiTinh === 'Nữ') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={gioiTinh}>
                        {gioiTinh.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'trangThai',
            key: 'trangThai',
            filters: [
                { text: 'Thực tập sinh', value: 'Thực tập sinh' },
                { text: 'Full time', value: 'Full time' },
                { text: 'Part time', value: 'Part time' },
            ],
            onFilter: (value, record) => record.trangThai?.indexOf(value as string) === 0,  // Sử dụng trangThai thay vì trangThai
            render: (trangThai: string): JSX.Element => {
                let color = '';
                if (trangThai === 'Thực tập sinh') {
                    color = 'green';
                } else if (trangThai === 'Full time') {
                    color = 'geekblue';
                } else if (trangThai === 'Part time') {
                    color = 'volcano';
                }

                return (
                    <Tag color={color} key={trangThai}>
                        {trangThai.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Quản lý',
            key: 'action',
            render: (_: any, record: NhanVienType) => {
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
            <h1 className='page-name'>QUẢN LÝ NHÂN VIÊN</h1>
            <div className="button-container">
                <Search className="custom-search" placeholder="Nhập tên nhân viên" onSearch={onSearch} enterButton />
                <div className="button-container">
                    <Button className='custom-button'>Hoàn tác</Button>
                    <Button className='custom-button'>Thêm</Button>
                    <Button className='custom-button'>Nhập Excel</Button>
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <NhanVienModal01
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                initialValues={selectedRecord || {}}
            />
        </Layout>
    );
};
export default NhanVien;

// Dữ liệu mẫu cho bảng
const data: NhanVienType[] = [
    {
        key: '1',
        maNhanVien: 'HV240001',
        tenNhanVien: 'Hà Đức Anh',
        gioiTinh: 'Nam',
        ngaySinh: '29/02/2002',
        trangThai: 'Full time',
    },
    {
        key: '2',
        maNhanVien: 'HV240002',
        tenNhanVien: 'Nguyễn Thị Mai',
        gioiTinh: 'Nữ',
        ngaySinh: '12/04/2001',
        trangThai: 'Full time',
    },
    {
        key: '3',
        maNhanVien: 'HV240003',
        tenNhanVien: 'Lê Văn Thành',
        gioiTinh: 'Nam',
        ngaySinh: '15/09/2000',
        trangThai: 'Full time',
    },
    {
        key: '4',
        maNhanVien: 'HV240004',
        tenNhanVien: 'Phạm Thanh Hằng',
        gioiTinh: 'Nữ',
        ngaySinh: '22/11/1999',
        trangThai: 'Full time',
    },
    {
        key: '5',
        maNhanVien: 'HV240005',
        tenNhanVien: 'Đỗ Minh Quang',
        gioiTinh: 'Nam',
        ngaySinh: '07/03/2003',
        trangThai: 'Part time',
    },
    {
        key: '6',
        maNhanVien: 'HV240006',
        tenNhanVien: 'Ngô Thị Lan',
        gioiTinh: 'Nữ',
        ngaySinh: '13/05/2000',
        trangThai: 'Full time',
    },
    {
        key: '7',
        maNhanVien: 'HV240007',
        tenNhanVien: 'Vũ Văn Bình',
        gioiTinh: 'Nam',
        ngaySinh: '19/07/2001',
        trangThai: 'Full time',
    },
    {
        key: '8',
        maNhanVien: 'HV240008',
        tenNhanVien: 'Trần Thị Duyên',
        gioiTinh: 'Nữ',
        ngaySinh: '01/01/2002',
        trangThai: 'Full time',
    },
    {
        key: '9',
        maNhanVien: 'HV240009',
        tenNhanVien: 'Nguyễn Văn Phong',
        gioiTinh: 'Nam',
        ngaySinh: '15/08/1998',
        trangThai: 'Thực tập sinh',
    },
    {
        key: '10',
        maNhanVien: 'HV240010',
        tenNhanVien: 'Lê Thị Hồng',
        gioiTinh: 'Nữ',
        ngaySinh: '05/09/2000',
        trangThai: 'Full time',
    },
    {
        key: '11',
        maNhanVien: 'HV240011',
        tenNhanVien: 'Phạm Văn Khánh',
        gioiTinh: 'Nam',
        ngaySinh: '23/12/2002',
        trangThai: 'Full time',
    },
    {
        key: '12',
        maNhanVien: 'HV240012',
        tenNhanVien: 'Nguyễn Văn Hưng',
        gioiTinh: 'Nam',
        ngaySinh: '30/03/2001',
        trangThai: 'Part time',
    },
    {
        key: '13',
        maNhanVien: 'HV240013',
        tenNhanVien: 'Nguyễn Thị Vân',
        gioiTinh: 'Nữ',
        ngaySinh: '09/06/2002',
        trangThai: 'Full time',
    },
    {
        key: '14',
        maNhanVien: 'HV240014',
        tenNhanVien: 'Trần Văn Quý',
        gioiTinh: 'Nam',
        ngaySinh: '19/11/1999',
        trangThai: 'Full time',
    },
    {
        key: '15',
        maNhanVien: 'HV240015',
        tenNhanVien: 'Hoàng Thị Ngọc',
        gioiTinh: 'Nữ',
        ngaySinh: '12/02/2003',
        trangThai: 'Full time',
    },
    {
        key: '16',
        maNhanVien: 'HV240016',
        tenNhanVien: 'Đặng Minh Tuấn',
        gioiTinh: 'Nam',
        ngaySinh: '05/05/2002',
        trangThai: 'Full time',
    },
    {
        key: '17',
        maNhanVien: 'HV240017',
        tenNhanVien: 'Bùi Thị Hồng Nhung',
        gioiTinh: 'Nữ',
        ngaySinh: '17/10/2001',
        trangThai: 'Full time',
    },
    {
        key: '18',
        maNhanVien: 'HV240018',
        tenNhanVien: 'Phạm Văn Hải',
        gioiTinh: 'Nam',
        ngaySinh: '22/04/2000',
        trangThai: 'Part time',
    },
    {
        key: '19',
        maNhanVien: 'HV240019',
        tenNhanVien: 'Lê Thị Tuyết',
        gioiTinh: 'Nữ',
        ngaySinh: '18/09/2003',
        trangThai: 'Full time',
    },
    {
        key: '20',
        maNhanVien: 'HV240020',
        tenNhanVien: 'Nguyễn Anh Đức',
        gioiTinh: 'Nam',
        ngaySinh: '03/07/2001',
        trangThai: 'Full time',
    },
    {
        key: '21',
        maNhanVien: 'HV240021',
        tenNhanVien: 'Phạm Thị Hoa',
        gioiTinh: 'Nữ',
        ngaySinh: '29/01/2002',
        trangThai: 'Full time',
    },
    {
        key: '22',
        maNhanVien: 'HV240022',
        tenNhanVien: 'Nguyễn Văn Bình',
        gioiTinh: 'Nam',
        ngaySinh: '15/03/2000',
        trangThai: 'Full time',
    },
    {
        key: '23',
        maNhanVien: 'HV240023',
        tenNhanVien: 'Ngô Thị Hương',
        gioiTinh: 'Nữ',
        ngaySinh: '08/05/2001',
        trangThai: 'Full time',
    },
    {
        key: '24',
        maNhanVien: 'HV240024',
        tenNhanVien: 'Trần Văn Sơn',
        gioiTinh: 'Nam',
        ngaySinh: '12/10/1999',
        trangThai: 'Part time',
    },
];



