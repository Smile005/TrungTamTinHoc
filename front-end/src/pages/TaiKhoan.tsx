import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { TaiKhoanType } from '../types/TaiKhoanType';
import '../styles/TableCustom.css';

const { Search } = Input;

// Sample Data
const initialData: TaiKhoanType[] = [
  { key: '1', maNhanVien: 'NV001', phanQuyen: 1, trangThai: 'Hoạt động' },
  { key: '2', maNhanVien: 'NV002', phanQuyen: 2, trangThai: 'Đã khóa' },
  { key: '3', maNhanVien: 'NV003', phanQuyen: 3, trangThai: 'Hoạt động' },
  { key: '4', maNhanVien: 'NV004', phanQuyen: 1, trangThai: 'Đã khóa' },
  { key: '5', maNhanVien: 'NV005', phanQuyen: 2, trangThai: 'Hoạt động' },
  { key: '6', maNhanVien: 'NV006', phanQuyen: 1, trangThai: 'Hoạt động' },
  { key: '7', maNhanVien: 'NV007', phanQuyen: 3, trangThai: 'Đã khóa' },
  { key: '8', maNhanVien: 'NV008', phanQuyen: 2, trangThai: 'Hoạt động' },
  { key: '9', maNhanVien: 'NV009', phanQuyen: 1, trangThai: 'Đã khóa' },
  { key: '10', maNhanVien: 'NV010', phanQuyen: 2, trangThai: 'Hoạt động' },
];

const TaiKhoan: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // Search input state
  const [filteredData, setFilteredData] = useState<TaiKhoanType[]>(initialData); // Filtered data state

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maNhanVien?.toLowerCase().includes(value.toLowerCase()) ||
      item.matKhau?.toLowerCase().includes(value.toLowerCase()) ||
      item.phanQuyen?.toString().includes(value) ||
      item.trangThai?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: TaiKhoanType) => {
    console.log('Selected Record:', record);
  };

  // Define table columns
  const columns = [
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
      width: '20%',
    },
    {
      title: 'Phân Quyền',
      dataIndex: 'phanQuyen',
      key: 'phanQuyen',
      width: '20%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Hoạt động' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{trangThai.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Quản lý',
      key: 'action',
      width: '10%',
      render: (_: any, record: TaiKhoanType) => {
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
      <h1 className='page-name'>QUẢN LÝ TÀI KHOẢN</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Mã Nhân Viên"
          onSearch={onSearch}
          enterButton
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
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
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />
    </Layout>
  );
};

export default TaiKhoan;
