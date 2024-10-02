import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PhongHocType } from '../types/PhongHocType';
import ThemPhongHocModal from '../components/ThemPhongHocModal';
import SuaPhongHocModal from '../components/SuaPhongHocModal'; // Import modal sửa phòng học
import '../styles/TableCustom.css';
import axios from 'axios';

const { Search } = Input;

const PhongHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); 
  const [filteredData, setFilteredData] = useState<PhongHocType[]>([]); // Dữ liệu phòng học từ API
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PhongHocType | null>(null);
  const [data, setData] = useState<PhongHocType[]>([]); // Dữ liệu phòng học từ API
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu

  useEffect(() => {
    const fetchPhongHoc = async () => {
        setLoading(true); // Bật trạng thái loading khi fetch dữ liệu
        try {
            const response = await axios.get('http://localhost:8081/api/phonghoc', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
                },
            });
            setData(response.data); // Lưu dữ liệu phòng học vào state
            setFilteredData(response.data); // Đặt dữ liệu vào filteredData để có thể tìm kiếm
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng học:', error);
        } finally {
            setLoading(false); // Tắt trạng thái loading
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
                if (trangThai === 'Đang Hoạt Động') {
                    color = 'geekblue';
                } else if (trangThai === 'Ngưng Hoạt Động') 
                    color = 'green';
                return (
                    <Tag color={color} key={trangThai}>
                        {trangThai.toUpperCase()}
                    </Tag>
                );
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
        loading={loading} // Hiển thị trạng thái loading khi đang fetch dữ liệu
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
