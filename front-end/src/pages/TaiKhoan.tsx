import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import SuaTaiKhoanModal from '../components/SuaTaiKhoanModal';
import ThemTaiKhoanModal from '../components/ThemTaiKhoanModal'; 
import DoiMatKhauModal from '../components/DoiMatKhauModal'; 
import { TaiKhoanType } from '../types/TaiKhoanType';
import axios from 'axios';
import '../styles/TableCustom.css';

const { Search } = Input;

const TaiKhoan: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<TaiKhoanType[]>([]);
  const [data, setData] = useState<TaiKhoanType[]>([]); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isThemModalVisible, setIsThemModalVisible] = useState(false); 
  const [isDoiMatKhauModalVisible, setIsDoiMatKhauModalVisible] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState<TaiKhoanType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTaiKhoan = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/auth/ds-taikhoan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data); 
        setFilteredData(response.data); 
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error);
        message.error('Lỗi khi lấy danh sách tài khoản!');
      } finally {
        setLoading(false);
      }
    };

    fetchTaiKhoan();
  }, []);

  const onSearch = (value: string) => {
    const filtered = data.filter((item) => {
      const phanQuyenText = item.phanQuyen === 1 ? 'Quản trị viên' : item.phanQuyen === 2 ? 'Người dùng' : 'Khác';
      return (
        item.maNhanVien.toLowerCase().includes(value.toLowerCase()) ||
        phanQuyenText.toLowerCase().includes(value.toLowerCase()) ||
        item.trangThai.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtered); 
    setSearchText(value); // Lưu từ khóa tìm kiếm
  };

  const handleMenuClick = (e: any, record: TaiKhoanType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    } else if (e.key === 'changepw') {
      setSelectedRecord(record);
      setIsDoiMatKhauModalVisible(true);
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

  const handleThemSubmit = (values: any) => {
    console.log('Thêm tài khoản mới:', values);
    setIsThemModalVisible(false);
  };

  const handleDoiMatKhauCancel = () => {
    setIsDoiMatKhauModalVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
      width: '20%',
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: '20%',
    },
    {
      title: 'Phân Quyền',
      dataIndex: 'phanQuyen',
      key: 'phanQuyen',
      width: '20%',
      render: (phanQuyen: number): JSX.Element => {
        let role = phanQuyen === 1 ? 'Quản trị viên' : phanQuyen === 2 ? 'Nhân viên' : 'Khác';
        return <span>{role}</span>;
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Đang hoạt động' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{trangThai}</Tag>;
      },
    },
    {
      title: 'Quản lý',
      key: 'action',
      width: '10%',
      render: (_: any, record: TaiKhoanType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="changepw" icon={<FileDoneOutlined />}>Đổi Mật Khẩu</Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />}>Sửa</Menu.Item>
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
          placeholder="Tìm kiếm Mã Nhân Viên, Phân Quyền, Trạng Thái"
          onSearch={onSearch} 
          enterButton
          value={searchText}
          onChange={(e) => onSearch(e.target.value)} 
        />
        <div className="button-container">
          <Button className='custom-button' onClick={() => setIsThemModalVisible(true)}>Thêm</Button>
          <Button className='custom-button'>Nhập Excel</Button>
        </div>
      </div>

      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData} 
        pagination={{ pageSize: 5 }}
        rowKey="maNhanVien"
        loading={loading}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />

      <SuaTaiKhoanModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord}
      />

      <ThemTaiKhoanModal
        visible={isThemModalVisible}
        onCancel={() => setIsThemModalVisible(false)}
        onSubmit={handleThemSubmit}
      />

      <DoiMatKhauModal
        visible={isDoiMatKhauModalVisible}
        onCancel={handleDoiMatKhauCancel}
        maNhanVien={selectedRecord?.maNhanVien || ''} 
      />
    </Layout>
  );
};

export default TaiKhoan;
