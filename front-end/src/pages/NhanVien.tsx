import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, TableColumnsType } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemNhanVienModal from '../components/ThemNhanVienModal';
import SuaNhanVienModal from '../components/SuaNhanVienModal';
import '../styles/TableCustom.css';
import { NhanVienType } from '../types/NhanVienType';
import axios from 'axios';
import moment from 'moment';

const { Search } = Input;

const NhanVien: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isThemModalVisible, setIsThemModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NhanVienType | null>(null);

  const [data, setData] = useState<NhanVienType[]>([]); 
  const [filteredData, setFilteredData] = useState<NhanVienType[]>([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    const fetchNhanVien = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setData(response.data); 
        setFilteredData(response.data); // Lưu dữ liệu đã lấy vào filteredData để hiển thị ban đầu
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchNhanVien();
  }, []);

  // Hàm tìm kiếm
  const onSearch = (value: string) => {
    const filtered = data.filter((item) =>
      item.tenNhanVien?.toLowerCase().includes(value.toLowerCase()) ||
      item.maNhanVien?.toLowerCase().includes(value.toLowerCase()) ||
      item.gioiTinh?.toLowerCase().includes(value.toLowerCase()) ||
      item.trangThai?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); 
  };

  const handleMenuClick = (e: any, record: NhanVienType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddCancel = () => {
    setIsThemModalVisible(false);
  };

  const handleOk = (values: any) => {
    console.log('Cập nhật thông tin nhân viên:', values);
    setIsModalVisible(false);
  };

  const handleAddOk = (values: any) => {
    console.log('Thêm nhân viên mới:', values);
    setIsThemModalVisible(false);
  };

  const columns: TableColumnsType<NhanVienType> = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
    },
    {
      title: 'Chức Vụ',
      dataIndex: 'chucVu',
      key: 'chucVu',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      filters: [
        { text: 'Nam', value: 'Nam' },
        { text: 'Nữ', value: 'Nữ' },
      ],
      onFilter: (value, record) => record.gioiTinh?.indexOf(value as string) === 0,
      render: (gioiTinh: string): JSX.Element => {
        let color = gioiTinh === 'Nam' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{gioiTinh.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ngày vào làm',
      dataIndex: 'ngayVaoLam',
      key: 'ngayVaoLam',
      render: (ngayVaoLam: string) => moment(ngayVaoLam).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      filters: [
        { text: 'Thực tập sinh', value: 'Thực tập sinh' },
        { text: 'Full time', value: 'Full time' },
        { text: 'Part time', value: 'Part time' },
      ],
      onFilter: (value, record) => record.trangThai?.indexOf(value as string) === 0,
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Full time' ? 'geekblue' : trangThai === 'Part time' ? 'green' : 'volcano';
        return <Tag color={color}>{trangThai}</Tag>;
      },
    },
    {
      title: 'Quản lý',
      key: 'action',
      render: (_: any, record: NhanVienType) => {
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
      <h1 className='page-name'>QUẢN LÝ NHÂN VIÊN</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Nhập tên nhân viên"
          onSearch={onSearch}
          enterButton
        />
        <div className="button-container">
          <Button className='custom-button' onClick={() => setIsThemModalVisible(true)}>Thêm</Button>
          <Button className='custom-button'>Nhập Excel</Button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData} // Hiển thị dữ liệu đã lọc
        loading={loading} 
        pagination={{ pageSize: 5 }}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />
      <SuaNhanVienModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        initialValues={selectedRecord}
    />

      <ThemNhanVienModal
        visible={isThemModalVisible}
        onCancel={handleAddCancel}
        onSubmit={handleAddOk}
      />
    </Layout>
  );
};

export default NhanVien;