import React, { useEffect, useState } from 'react';
import { Table, Layout, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ChiTietHoaDon from '../components/ChiTietHoaDon';
import '../styles/TableCustom.css'; 

const { Search } = Input;

const HoaDon: React.FC = () => {
  const [hoaDonList, setHoaDonList] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHoaDon, setSelectedHoaDon] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchHoaDonList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/hoadon/ds-hoadon', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setHoaDonList(response.data);
      setFilteredData(response.data); 
    } catch (error) {
      message.error('Lỗi khi lấy danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoaDonList();
  }, []);

  const onSearch = (value: string) => {
    const filtered = hoaDonList.filter((item) =>
      item.maHoaDon?.toLowerCase().includes(value.toLowerCase()) ||
      item.tenNhanVien?.toLowerCase().includes(value.toLowerCase()) ||
      item.tenHocVien?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleViewDetails = (maHoaDon: string) => {
    setSelectedHoaDon(maHoaDon);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Mã Hóa Đơn',
      dataIndex: 'maHoaDon',
      key: 'maHoaDon',
      width: '20%',  
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: '25%',  
    },
    {
      title: 'Tên Học Viên',
      dataIndex: 'tenHocVien',
      key: 'tenHocVien',
      width: '25%',  
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: '15%',  
      render: (text: any, record: any) => (
        <Link to="#" onClick={() => handleViewDetails(record.maHoaDon)}>
          Xem Chi Tiết
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-name">DANH SÁCH HÓA ĐƠN</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Nhập mã hóa đơn, tên nhân viên, tên học viên"
          onSearch={onSearch}
          enterButton
        />
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        loading={loading}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />

      {selectedHoaDon && (
        <ChiTietHoaDon
          visible={isModalVisible}
          onCancel={handleCancel}
          maHoaDon={selectedHoaDon}
        />
      )}
    </Layout>
  );
};

export default HoaDon;
