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
import { useTranslation } from 'react-i18next';

const { Search } = Input;

const NhanVien: React.FC = () => {
  const phanQuyen = useSelector((state: RootState) => state.auth.userInfo?.phanQuyen);
  const { t } = useTranslation();
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

  const deleteNhanVien = async (maNhanVien: string | undefined) => {
    if (!maNhanVien) {
      message.error(t('deleteError'));
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
      message.success(t('deleteSuccess'));
      dispatch(fetchNhanVienData());
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      message.error(t('deleteError'));
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/nhanvien/export-nhanvien', {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'nhanvien_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Lỗi khi tải file Excel:', error);
      message.error(t('exportError'));
    }
  };

  const columns: TableColumnsType<NhanVienType> = [
    {
      title: t('employeeId'),
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
    },
    {
      title: t('employeeName'),
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
        { text: t('activenv'), value: 'Đang Làm Việc' },
        { text: t('inactivenv'), value: 'Đã Nghỉ' },
      ],
      onFilter: (value, record) => record.trangThai?.indexOf(value as string) === 0,
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Đang Làm Việc' ? 'geekblue' : trangThai === 'Đã Nghỉ' ? 'green' : 'volcano';
        return <Tag color={color}>{trangThai}</Tag>;
      },
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, record: NhanVienType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>{t('edit&detail')}</Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>{t('delete')}</Menu.Item>
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

  const hasPermission = phanQuyen === 0 || phanQuyen === 1;
  if (!hasPermission) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <Layout>
      <h1 className='page-name'>{t('employeeManagement')}</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder={t('searchPlaceholder')}
          onSearch={onSearch}
          enterButton
        />
        <div className="button-container">
          <Button className='custom-button' onClick={() => setIsThemModalVisible(true)}>{t('addnv')}</Button>
          <Button className='custom-button' onClick={handleExportExcel}>{t('exportExcel')}</Button>
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
