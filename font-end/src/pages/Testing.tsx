import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import HocVienModal01 from '../components/HocVienModal01';

interface DataType {
    key: string;
    maHocVien: string;
    tenHocVien: string;
    gioiTinh: string;
    ngaySinh: string;
    tinhTrang: string;
}

const Testing: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

    // Hàm xử lý khi chọn menu
    const handleMenuClick = (e: any, record: DataType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);  // Lưu lại thông tin học viên được chọn
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
        console.log('Cập nhật thông tin học viên:', values);
        // Thực hiện cập nhật thông tin học viên ở đây
        setIsModalVisible(false);
    };

    // Cột của bảng với STT liên tục
    const columns = [
        {
            title: 'Mã học viên',
            dataIndex: 'maHocVien',
            key: 'maHocVien',
            sorter: (a: DataType, b: DataType) => a.maHocVien.localeCompare(b.maHocVien), // Sắp xếp theo mã học viên
        },
        {
            title: 'Họ và tên',
            dataIndex: 'tenHocVien',
            key: 'tenHocVien',
            sorter: (a: DataType, b: DataType) => a.tenHocVien.localeCompare(b.tenHocVien), // Sắp xếp theo tên học viên
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            sorter: (a: DataType, b: DataType) => a.gioiTinh.localeCompare(b.gioiTinh), // Sắp xếp theo giới tính
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
            sorter: (a: DataType, b: DataType) => new Date(a.ngaySinh).getTime() - new Date(b.ngaySinh).getTime(), // Sắp xếp theo ngày sinh
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            sorter: (a: DataType, b: DataType) => a.tinhTrang.localeCompare(b.tinhTrang), // Sắp xếp theo tình trạng học tập
        },
        {
            title: 'Quản lý',
            key: 'action',
            render: (_: any, record: DataType) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="edit">Chỉnh sửa</Menu.Item>
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
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />

            {/* Sử dụng component EditStudentModal */}
            <HocVienModal01
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                initialValues={selectedRecord || {}}
            />
        </Layout>
    );
};

export default Testing;

// Dữ liệu mẫu cho bảng
const data: DataType[] = [
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
        gioiTinh: 'Nam',
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
        tinhTrang: 'Đang học',
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
        tinhTrang: 'Đã tốt nghiệp',
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



