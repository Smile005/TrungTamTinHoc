import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, TableColumnsType, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemNhanVienModal from '../components/ThemNhanVienModal';
import SuaNhanVienModal from '../components/SuaNhanVienModal';
import '../styles/TableCustom.css';
import { NhanVienType } from '../types/NhanVienType';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchNhanVienData } from '../store/slices/nhanVienSlice';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const { Search } = Input;

const NhanVien: React.FC = () => {
  const { t } = useTranslation(); // Sử dụng hook useTranslation để dịch
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isThemModalVisible, setIsThemModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NhanVienType | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.nhanvien);

  const [filteredData, setFilteredData] = useState<NhanVienType[]>([]);

  useEffect(() => {
    dispatch(fetchNhanVienData()); 
  }, [dispatch]);

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
    } else if (e.key === 'delete') {
      deleteNhanVien(record.maNhanVien); 
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddCancel = () => {
    setIsThemModalVisible(false);
  };

  const handleOk = async (values: NhanVienType) => {
    console.log('Cập nhật thông tin nhân viên:', values);
    setIsModalVisible(false);

    dispatch(fetchNhanVienData());
  };

  const handleAddOk = () => {
    setIsThemModalVisible(false);
    dispatch(fetchNhanVienData()); 
  };

  // Hàm xóa nhân viên
  const deleteNhanVien = async (maNhanVien: string | undefined) => {
    if (!maNhanVien) {
      message.error(t('deleteError')); // Sử dụng dịch ngôn ngữ
      return;
    }

    try {
      await axios.post('http://localhost:8081/api/nhanvien/xoa-nhanvien', 
        { maNhanVien }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success(t('deleteSuccess')); // Sử dụng dịch ngôn ngữ
      dispatch(fetchNhanVienData()); 
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      message.error(t('deleteError')); // Sử dụng dịch ngôn ngữ
    }
  };

  const columns: TableColumnsType<NhanVienType> = [
    {
      title: t('employeeId'), // Sử dụng dịch ngôn ngữ
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
    },
    {
      title: t('employeeName'), // Sử dụng dịch ngôn ngữ
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
    },
    {
      title: t('role'), 
      dataIndex: 'chucVu',
      key: 'chucVu',
    },
    {
      title: t('gender'), 
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      filters: [
        { text: t('male'), value: 'Nam' },
        { text: t('female'), value: 'Nữ' },
      ],
      onFilter: (value, record) => record.gioiTinh?.indexOf(value as string) === 0,
      render: (gioiTinh: string): JSX.Element => {
        let color = gioiTinh === 'Nam' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{gioiTinh}</Tag>;
      },
    },
    {
      title: t('startDate'), 
      dataIndex: 'ngayVaoLam',
      key: 'ngayVaoLam',
    },
    {
      title: t('status'), 
      dataIndex: 'trangThai',
      key: 'trangThai',
      filters: [
        { text: t('intern'), value: 'Thực tập sinh' },
        { text: t('fullTime'), value: 'Full time' },
        { text: t('partTime'), value: 'Part time' },
      ],
      onFilter: (value, record) => record.trangThai?.indexOf(value as string) === 0,
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Full time' ? 'geekblue' : trangThai === 'Part time' ? 'green' : 'volcano';
        return <Tag color={color}>{trangThai}</Tag>;
      },
    },
    {
      title: t('action'), // Sử dụng dịch ngôn ngữ
      key: 'action',
      render: (_: any, record: NhanVienType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>{t('edit&detail')}</Menu.Item> {/* Sử dụng dịch ngôn ngữ */}
            <Menu.Item key="delete" icon={<DeleteOutlined />}>{t('delete')}</Menu.Item> {/* Sử dụng dịch ngôn ngữ */}
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
      <h1 className='page-name'>{t('employeeManagement')}</h1> {/* Sử dụng dịch ngôn ngữ */}
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder={t('searchPlaceholder')} // Sử dụng dịch ngôn ngữ
          onSearch={onSearch}
          enterButton
        />
        <div className="button-container">
          <Button className='custom-button' onClick={() => setIsThemModalVisible(true)}>{t('add')}</Button> {/* Sử dụng dịch ngôn ngữ */}
          <Button className='custom-button'>{t('importExcel')}</Button> {/* Sử dụng dịch ngôn ngữ */}
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData.length ? filteredData : data} 
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
