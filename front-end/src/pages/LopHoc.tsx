import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LopHocType } from '../types/LopHocType';
import '../styles/TableCustom.css';

const { Search } = Input;

// Sample Data (Updated with existing and additional records)
const initialData: LopHocType[] = [
  { key: '1', maLopHoc: 'LH001', tenLopHoc: 'Lớp A', maMonHoc: 'MH001', maGiangVien: 'GV001', ngayBatDau: '2023-09-22', soLuong: '30', trangThai: 'Còn trống', ghiChu: '', },
  { key: '2', maLopHoc: 'LH002', tenLopHoc: 'Lớp B', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '3', maLopHoc: 'LH002', tenLopHoc: 'Lớp C', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '4', maLopHoc: 'LH002', tenLopHoc: 'Lớp D', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '5', maLopHoc: 'LH002', tenLopHoc: 'Lớp E', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '6', maLopHoc: 'LH003', tenLopHoc: 'Lớp Toán 12A', maMonHoc: 'MH001', maGiangVien: 'GV001', ngayBatDau: '2024-01-10', soLuong: '30', trangThai: 'Hoạt động', ghiChu: '', },
  { key: '7', maLopHoc: 'LH004', tenLopHoc: 'Lớp Lý thuyết đồ thị', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: '2024-02-12', soLuong: '25', trangThai: 'Hoạt động', ghiChu: '', },
  { key: '8', maLopHoc: 'LH005', tenLopHoc: 'Lớp Giải tích 11B', maMonHoc: 'MH003', maGiangVien: 'GV001', ngayBatDau: '2024-03-15', soLuong: '28', trangThai: 'Hoạt động', ghiChu: 'Ghi chú về lớp', },
  { key: '9', maLopHoc: 'LH006', tenLopHoc: 'Lớp Khoa học máy tính', maMonHoc: 'MH004', maGiangVien: 'GV003', ngayBatDau: '2024-04-20', soLuong: '35', trangThai: 'Tạm ngưng', ghiChu: 'Chờ học viên mới', },
  { key: '10', maLopHoc: 'LH007', tenLopHoc: 'Lớp Lập trình C cơ bản', maMonHoc: 'MH005', maGiangVien: 'GV004', ngayBatDau: '2024-05-01', soLuong: '20', trangThai: 'Hoạt động', ghiChu: '', },
];

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // Search input state
  const [filteredData, setFilteredData] = useState<LopHocType[]>(initialData); // Filtered data state

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuong.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: LopHocType) => {
    console.log('Selected Record:', record);
  };

  // Define table columns
  const columns = [
    {
      title: 'Mã Lớp Học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
      width: '12%',
    },
    {
      title: 'Tên Lớp Học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
      width: '12%',
    },
    {
      title: 'Mã Môn Học',
      dataIndex: 'maMonHoc',
      key: 'maMonHoc',
      width: '12%',
    },
    {
      title: 'Mã Giảng Viên',
      dataIndex: 'maGiangVien',
      key: 'maGiangVien',
      width: '12%',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      width: '15%',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: '10%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Đang hoạt động' ? 'geekblue' : 'green';
        return <Tag color={color} key={trangThai}>{trangThai.toUpperCase()}</Tag>;
      },
      width: '8%',
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
      width: '8%',
      render: (_: any, record: LopHocType) => {
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
      <h1 className='page-name'>QUẢN LÝ LỚP HỌC</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Mã Lớp Học, Tên Lớp Học"
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

export default LopHoc;
