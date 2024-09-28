import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { PhongHocType } from '../types/PhongHocType';
import '../styles/TableCustom.css';

const { Search } = Input;

// Sample Data
const initialData: PhongHocType[] = [
  { key: '1', maPhong: 'PH001', soLuong: 30, trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '2', maPhong: 'PH002', soLuong: 25, trangThai: 'Ngưng hoạt động', ghiChu: 'Sử dụng buổi sáng' },
  { key: '3', maPhong: 'PH003', soLuong: 20, trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '4', maPhong: 'PH004', soLuong: 35, trangThai: 'Đang hoạt động', ghiChu: 'Sửa điều hòa' },
  { key: '5', maPhong: 'PH005', soLuong: 40, trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '6', maPhong: 'PH006', soLuong: 50, trangThai: 'Ngưng hoạt động', ghiChu: 'Sử dụng buổi chiều' },
  { key: '7', maPhong: 'PH007', soLuong: 45, trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '8', maPhong: 'PH008', soLuong: 60, trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '9', maPhong: 'PH009', soLuong: 55, trangThai: 'Ngưng hoạt động', ghiChu: '' },
  { key: '10', maPhong: 'PH010', soLuong: 20, trangThai: 'Đang hoạt động', ghiChu: '' },
];

const PhongHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // Search input state
  const [filteredData, setFilteredData] = useState<PhongHocType[]>(initialData); // Filtered data state

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maPhong.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuong?.toString().includes(value) ||
      item.trangThai?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: PhongHocType) => {
    console.log('Selected Record:', record);
  };

  // Define table columns
  const columns = [
    {
      title: 'Mã Phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      width: '20%',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: '20%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Đang hoạt động' ? 'geekblue' : 'green';
        return <Tag color={color} key={trangThai}>{trangThai.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: '30%',
    },
    {
      title: 'Quản lý',
      key: 'action',
      width: '10%',
      render: (_: any, record: PhongHocType) => {
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
      <h1 className='page-name'>QUẢN LÝ PHÒNG HỌC</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Mã Phòng, Số Lượng"
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

export default PhongHoc;
