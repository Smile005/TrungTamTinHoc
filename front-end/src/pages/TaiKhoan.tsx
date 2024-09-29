import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SuaTaiKhoanModal from '../components/SuaTaiKhoanModal';
import { TaiKhoanType } from '../types/TaiKhoanType';
import '../styles/TableCustom.css';

const { Search } = Input;

const initialData: TaiKhoanType[] = [
  { maNhanVien: 'NV001', phanQuyen: 1, trangThai: 'Hoạt động' },
  { maNhanVien: 'NV002', phanQuyen: 2, trangThai: 'Đã khóa' },
  { maNhanVien: 'NV003', phanQuyen: 3, trangThai: 'Hoạt động' },
  { maNhanVien: 'NV004', phanQuyen: 1, trangThai: 'Đã khóa' },
  { maNhanVien: 'NV005', phanQuyen: 2, trangThai: 'Hoạt động' },
  { maNhanVien: 'NV006', phanQuyen: 1, trangThai: 'Hoạt động' },
  { maNhanVien: 'NV007', phanQuyen: 3, trangThai: 'Đã khóa' },
  { maNhanVien: 'NV008', phanQuyen: 2, trangThai: 'Hoạt động' },
  { maNhanVien: 'NV009', phanQuyen: 1, trangThai: 'Đã khóa' },
  { maNhanVien: 'NV010', phanQuyen: 2, trangThai: 'Hoạt động' },
];

const TaiKhoan: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<TaiKhoanType[]>(initialData);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TaiKhoanType | null>(null);

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maNhanVien.toLowerCase().includes(value.toLowerCase()) ||
      item.phanQuyen.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: TaiKhoanType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (values: any) => {
    console.log('Updated Tai Khoan:', values);
    setIsEditModalVisible(false);
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
          </Button>
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

      <SuaTaiKhoanModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord} // Passing the selected record for editing
      />
    </Layout>
  );
};

export default TaiKhoan;
