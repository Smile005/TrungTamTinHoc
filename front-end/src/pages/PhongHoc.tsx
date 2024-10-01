import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PhongHocType } from '../types/PhongHocType';
import ThemPhongHocModal from '../components/ThemPhongHocModal';
import SuaPhongHocModal from '../components/SuaPhongHocModal'; // Import modal sửa phòng học
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
  const [searchText, setSearchText] = useState(''); 
  const [filteredData, setFilteredData] = useState<PhongHocType[]>(initialData); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PhongHocType | null>(null); 

  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maPhong.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuong?.toString().includes(value) ||
      item.trangThai?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide modal thêm
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = (values: any) => {
    console.log('Thêm Phòng Học:', values);
    const newData = [...filteredData, { key: String(filteredData.length + 1), ...values }];
    setFilteredData(newData);
    setIsModalVisible(false);
  };

  const handleMenuClick = (e: any, record: PhongHocType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record); 
      setIsEditModalVisible(true); 
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = (values: any) => {
    console.log('Sửa thông tin Phòng Học:', values);
    const updatedData = filteredData.map((item) => (item.maPhong === values.maPhong ? values : item));
    setFilteredData(updatedData);
    setIsEditModalVisible(false);
  };

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
        return <Tag color={color}>{trangThai.toUpperCase()}</Tag>;
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
          <Button className='custom-button' onClick={showModal}>Thêm</Button>
          <Button className='custom-button'>Nhập Excel</Button>
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

      <ThemPhongHocModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleOk}
      />

      <SuaPhongHocModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord} 
      />
    </Layout>
  );
};

export default PhongHoc;
