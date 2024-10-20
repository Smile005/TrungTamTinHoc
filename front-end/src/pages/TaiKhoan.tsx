import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import SuaTaiKhoanModal from '../components/SuaTaiKhoanModal';
import ThemTaiKhoanModal from '../components/ThemTaiKhoanModal'; 
import DoiMatKhauModal from '../components/DoiMatKhauModal'; 
import { TaiKhoanType } from '../types/TaiKhoanType';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchTaiKhoanData } from '../store/slices/taiKhoanSlice';
import axios from 'axios';

const { Search } = Input;

const TaiKhoan: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isThemModalVisible, setIsThemModalVisible] = useState(false); 
  const [isDoiMatKhauModalVisible, setIsDoiMatKhauModalVisible] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState<TaiKhoanType | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.taikhoan);

  useEffect(() => {
    dispatch(fetchTaiKhoanData());
  }, [dispatch]);

  const onSearch = (value: string) => {
    const filtered = data.filter((item: TaiKhoanType) => {
      const phanQuyenText = item.phanQuyen === 1 ? 'Quản trị viên' : item.phanQuyen === 2 ? 'Người dùng' : 'Khác';
      return (
        item.maNhanVien.toLowerCase().includes(value.toLowerCase()) ||
        phanQuyenText.toLowerCase().includes(value.toLowerCase()) ||
        item.trangThai.toLowerCase().includes(value.toLowerCase())
      );
    });
    return filtered;
  };

  const handleMenuClick = (e: any, record: TaiKhoanType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    } else if (e.key === 'changepw') {
      setSelectedRecord(record);
      setIsDoiMatKhauModalVisible(true);
    } else if (e.key === 'delete') {
      handleDelete(record.maNhanVien);
    }
  };

  const handleDelete = async (maNhanVien: string) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/xoa-taikhoan/${maNhanVien}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('Xóa tài khoản thành công!');
      dispatch(fetchTaiKhoanData()); // Reload dữ liệu sau khi xóa
    } catch (error) {
      message.error('Xóa tài khoản thất bại!');
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleThemSubmit = (values: any) => {
    setIsThemModalVisible(false);
    dispatch(fetchTaiKhoanData()); // Reload lại dữ liệu sau khi thêm 
  };

  const handleEditSubmit = (values: any) => {
    setIsEditModalVisible(false);
    dispatch(fetchTaiKhoanData()); // Reload lại dữ liệu sau khi sửa
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
            <Menu.Item key="edit" icon={<EditOutlined />}>Sửa Quyền và Trạng Thái</Menu.Item>
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
          onChange={(e) => setSearchText(e.target.value)} 
        />
        <div className="button-container">
          <Button className='custom-button' onClick={() => setIsThemModalVisible(true)}>Thêm</Button>
          <Button className='custom-button'>Nhập Excel</Button>
        </div>
      </div>

      <Table
        className="custom-table"
        columns={columns}
        dataSource={onSearch(searchText)}
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
        taiKhoanData={data} 
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
