import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PhongHocType } from '../types/PhongHocType';
import ThemPhongHocModal from '../components/ThemPhongHocModal';
import SuaPhongHocModal from '../components/SuaPhongHocModal';
import '../styles/TableCustom.css';
import axios from 'axios';

const { Search } = Input;

const PhongHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); 
  const [filteredData, setFilteredData] = useState<PhongHocType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PhongHocType | null>(null);
  const [data, setData] = useState<PhongHocType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhongHoc = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/phonghoc/ds-phong', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng học:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhongHoc();
  }, []);

  const onSearch = (value: string) => {
    const filtered = data.filter((item) =>
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
        let color = '';
        const normalizedTrangThai = trangThai.toLowerCase();
        
        if (normalizedTrangThai === 'đang hoạt động') {
            color = 'geekblue';
        } else if (normalizedTrangThai === 'ngưng hoạt động') {
            color = 'green';
        }
        
        return (
            <Tag color={color} key={trangThai}>
                {trangThai.toUpperCase()}
            </Tag>
        );
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
        loading={loading}
        rowKey="maPhong"
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
