import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, TableColumnsType, Input, GetProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { HocVienType } from '../types/HocVienType';
import ThemHocVienModal from '../components/ThemHocVienModal';
import HocVienModal01 from '../components/HocVienModal01';
import '../styles/TableCustom.css';
import ImportExcelModal from '../components/ImportExcelModal';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const HocVien: React.FC = () => {
    const [isThemHocVienModalVisible, setIsThemHocVienModalVisible] = useState(false); // Modal Thêm Học Viên
    const [isImportModalVisible, setIsImportModalVisible] = useState(false); // Modal Nhập Excel
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal Chỉnh sửa
    const [modalType, setModalType] = useState<'hocvien' | 'nhanvien'>('hocvien'); // Biến để xác định loại modal

    const [selectedRecord, setSelectedRecord] = useState<HocVienType | null>(null);

    const handleMenuClick = (e: any, record: HocVienType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);  
            setIsEditModalVisible(true); 
        }
    };

    const showImportModal = (type: 'hocvien' | 'nhanvien') => {
        setModalType(type);
        setIsImportModalVisible(true);
    };

    const showHocVienModal = () => {
        setIsThemHocVienModalVisible(true);
    };

    const handleThemHocVien = (hocVien: HocVienType) => {
        console.log('Học viên mới:', hocVien);
        handleCancel();
    };

    const handleCancel = () => {
        setIsThemHocVienModalVisible(false);
        setIsImportModalVisible(false);
        setIsEditModalVisible(false);
    };

    const handleOk = (values: any) => {
        console.log('Cập nhật thông tin học viên:', values);
        setIsEditModalVisible(false);
    };

    const columns: TableColumnsType<HocVienType> = [
        {
            title: 'Mã học viên',
            dataIndex: 'maHocVien',
            key: 'maHocVien',
            width: '8%',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'tenHocVien',
            key: 'tenHocVien',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            width: '6%',
            filters: [
                { text: 'Nam', value: 'Nam' },
                { text: 'Nữ', value: 'Nữ' },
                { text: 'Undefined', value: 'Undefined' },
            ],
            onFilter: (value, record) => {
                if (value === 'Undefined') {
                    return record.gioiTinh === undefined; // Trả về true nếu gioiTinh là undefined
                }
                if (record.gioiTinh === undefined) return false; // Trả về false thay vì "undefined"
                return record.gioiTinh.indexOf(value as string) === 0;
            },
            render: (gioiTinh: string | undefined): JSX.Element => {
                let color = '';
                if (gioiTinh === 'Nam') {
                    color = 'geekblue';
                } else if (gioiTinh === 'Nữ') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={gioiTinh}>
                        {gioiTinh ? gioiTinh : 'Undefined'}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
            width: '6%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            width: '8%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            width: '6%',
            filters: [
                { text: 'Chưa đăng ký', value: 'Chưa đăng ký' },
                { text: 'Đang học', value: 'Đang học' },
                { text: 'Đã tốt nghiệp', value: 'Đã tốt nghiệp' },
            ],
            onFilter: (value, record) => record.tinhTrang.indexOf(value as string) === 0,
            render: (tinhTrang: string): JSX.Element => {
                let color = '';
                if (tinhTrang === 'Chưa đăng ký') {
                    color = 'green';
                } else if (tinhTrang === 'Đang học') {
                    color = 'geekblue';
                } else if (tinhTrang === 'Đã tốt nghiệp') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={tinhTrang}>
                        {tinhTrang.toUpperCase()}
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
            width: '6%',
            render: (_: any, record: HocVienType) => {
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
            <h1 className='page-name'>QUẢN LÝ HỌC VIÊN</h1>
            <div className="button-container">
                <Search
                    className="custom-search"
                    placeholder="Nhập tên học viên"
                    onSearch={onSearch}
                    enterButton
                />
                <div className="button-container">
                    <Button className='custom-button'>Hoàn tác</Button>
                    <Button className='custom-button' onClick={showHocVienModal}>Thêm</Button>
                    <Button className='custom-button' onClick={() => showImportModal('hocvien')}>
                        Nhập Excel
                    </Button> {/* Thêm sự kiện onClick */}
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <ThemHocVienModal
                visible={isThemHocVienModalVisible}
                onCancel={handleCancel}
                onSubmit={handleThemHocVien}
            />

            <ImportExcelModal
                visible={isImportModalVisible}
                onCancel={handleCancel}
                modalType={modalType} 
            />

            <HocVienModal01
                visible={isEditModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                initialValues={selectedRecord || {}}
            />

        </Layout>
    );
};
export default HocVien;

// Dữ liệu mẫu cho bảng
const data: HocVienType[] = [
    {
        key: '1',
        maHocVien: 'HV240001',
        tenHocVien: 'Hà Đức Anh',
        gioiTinh: 'Nam',
        ngaySinh: '29/02/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '2',
        maHocVien: 'HV240002',
        tenHocVien: 'Nguyễn Thị Mai',
        gioiTinh: 'Nữ',
        ngaySinh: '12/04/2001',
        tinhTrang: 'Đang học',
    },
    {
        key: '3',
        maHocVien: 'HV240003',
        tenHocVien: 'Lê Văn Thành',
        gioiTinh: undefined,
        ngaySinh: '15/09/2000',
        tinhTrang: 'Đang học',
    },
    {
        key: '4',
        maHocVien: 'HV240004',
        tenHocVien: 'Phạm Thanh Hằng',
        gioiTinh: 'Nữ',
        ngaySinh: '22/11/1999',
        tinhTrang: 'Đang học',
    },
    {
        key: '5',
        maHocVien: 'HV240005',
        tenHocVien: 'Đỗ Minh Quang',
        gioiTinh: 'Nam',
        ngaySinh: '07/03/2003',
        tinhTrang: 'Đã tốt nghiệp',
    },
    {
        key: '6',
        maHocVien: 'HV240006',
        tenHocVien: 'Ngô Thị Lan',
        gioiTinh: 'Nữ',
        ngaySinh: '13/05/2000',
        tinhTrang: 'Đang học',
    },
    {
        key: '7',
        maHocVien: 'HV240007',
        tenHocVien: 'Vũ Văn Bình',
        gioiTinh: 'Nam',
        ngaySinh: '19/07/2001',
        tinhTrang: 'Đang học',
    },
    {
        key: '8',
        maHocVien: 'HV240008',
        tenHocVien: 'Trần Thị Duyên',
        gioiTinh: 'Nữ',
        ngaySinh: '01/01/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '9',
        maHocVien: 'HV240009',
        tenHocVien: 'Nguyễn Văn Phong',
        gioiTinh: 'Nam',
        ngaySinh: '15/08/1998',
        tinhTrang: 'Chưa đăng ký',
    },
    {
        key: '10',
        maHocVien: 'HV240010',
        tenHocVien: 'Lê Thị Hồng',
        gioiTinh: 'Nữ',
        ngaySinh: '05/09/2000',
        tinhTrang: 'Đang học',
    },
    {
        key: '11',
        maHocVien: 'HV240011',
        tenHocVien: 'Phạm Văn Khánh',
        gioiTinh: 'Nam',
        ngaySinh: '23/12/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '12',
        maHocVien: 'HV240012',
        tenHocVien: 'Nguyễn Văn Hưng',
        gioiTinh: 'Nam',
        ngaySinh: '30/03/2001',
        tinhTrang: 'Đã tốt nghiệp',
    },
    {
        key: '13',
        maHocVien: 'HV240013',
        tenHocVien: 'Nguyễn Thị Vân',
        gioiTinh: 'Nữ',
        ngaySinh: '09/06/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '14',
        maHocVien: 'HV240014',
        tenHocVien: 'Trần Văn Quý',
        gioiTinh: 'Nam',
        ngaySinh: '19/11/1999',
        tinhTrang: 'Đang học',
    },
    {
        key: '15',
        maHocVien: 'HV240015',
        tenHocVien: 'Hoàng Thị Ngọc',
        gioiTinh: 'Nữ',
        ngaySinh: '12/02/2003',
        tinhTrang: 'Đang học',
    },
    {
        key: '16',
        maHocVien: 'HV240016',
        tenHocVien: 'Đặng Minh Tuấn',
        gioiTinh: 'Nam',
        ngaySinh: '05/05/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '17',
        maHocVien: 'HV240017',
        tenHocVien: 'Bùi Thị Hồng Nhung',
        gioiTinh: 'Nữ',
        ngaySinh: '17/10/2001',
        tinhTrang: 'Đang học',
    },
    {
        key: '18',
        maHocVien: 'HV240018',
        tenHocVien: 'Phạm Văn Hải',
        gioiTinh: 'Nam',
        ngaySinh: '22/04/2000',
        tinhTrang: 'Đã tốt nghiệp',
    },
    {
        key: '19',
        maHocVien: 'HV240019',
        tenHocVien: 'Lê Thị Tuyết',
        gioiTinh: 'Nữ',
        ngaySinh: '18/09/2003',
        tinhTrang: 'Đang học',
    },
    {
        key: '20',
        maHocVien: 'HV240020',
        tenHocVien: 'Nguyễn Anh Đức',
        gioiTinh: 'Nam',
        ngaySinh: '03/07/2001',
        tinhTrang: 'Đang học',
    },
    {
        key: '21',
        maHocVien: 'HV240021',
        tenHocVien: 'Phạm Thị Hoa',
        gioiTinh: 'Nữ',
        ngaySinh: '29/01/2002',
        tinhTrang: 'Đang học',
    },
    {
        key: '22',
        maHocVien: 'HV240022',
        tenHocVien: 'Nguyễn Văn Bình',
        gioiTinh: 'Nam',
        ngaySinh: '15/03/2000',
        tinhTrang: 'Đang học',
    },
    {
        key: '23',
        maHocVien: 'HV240023',
        tenHocVien: 'Ngô Thị Hương',
        gioiTinh: 'Nữ',
        ngaySinh: '08/05/2001',
        tinhTrang: 'Đang học',
    },
    {
        key: '24',
        maHocVien: 'HV240024',
        tenHocVien: 'Trần Văn Sơn',
        gioiTinh: 'Nam',
        ngaySinh: '12/10/1999',
        tinhTrang: 'Đã tốt nghiệp',
    },
];



