import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';
import ThemLopHocModal from '../components/ThemLopHocModal';
import SuaLopHocModal from '../components/SuaLopHocModal';
import '../styles/TableCustom.css';
import moment from 'moment';

const { Search } = Input;

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<LopHocType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LopHocType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [monHocMap, setMonHocMap] = useState<{ [key: string]: string }>({});
  const [nhanVienMap, setNhanVienMap] = useState<{ [key: string]: string }>({});

  // Gọi API để lấy danh sách lớp học, môn học và giảng viên
  useEffect(() => {
    const fetchLopHocData = async () => {
      setLoading(true);
      try {
        const [lopHocResponse, nhanVienResponse, monHocResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get('http://localhost:8081/api/monhoc/ds-monhoc', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        // Tạo map cho mã môn học và tên môn học
        const monHocMap = monHocResponse.data.reduce((acc: any, monHoc: any) => {
          acc[monHoc.maMonHoc] = monHoc.tenMonHoc;
          return acc;
        }, {});

        // Tạo map cho mã nhân viên và tên nhân viên
        const nhanVienMap = nhanVienResponse.data.reduce((acc: any, nhanVien: any) => {
          acc[nhanVien.maNhanVien] = nhanVien.tenNhanVien;
          return acc;
        }, {});

        setMonHocMap(monHocMap);
        setNhanVienMap(nhanVienMap);

        const formattedLopHoc = lopHocResponse.data.map((lopHoc: LopHocType) => ({
          ...lopHoc,
          tenMonHoc: lopHoc.maMonHoc ? monHocMap[lopHoc.maMonHoc] : 'Không xác định', 
          tenNhanVien: lopHoc.maNhanVien ? nhanVienMap[lopHoc.maNhanVien] : 'Không xác định', 
      }));
      

        setFilteredData(formattedLopHoc);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        message.error('Lỗi khi lấy dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocData();
  }, []);

  const onSearch = (value: string) => {
    const filtered = filteredData.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuong.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: LopHocType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    } else if (e.key === 'delete') {
      message.info(`Xóa lớp học: ${record.tenLopHoc}`);
    }
  };

  const handleAddClass = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleOk = (values: any) => {
    const newData = [...filteredData, { key: String(filteredData.length + 1), ...values }];
    setFilteredData(newData);
    setIsModalVisible(false);
    message.success('Thêm mới lớp học thành công!');
  };

  const handleEditSubmit = (values: any) => {
    const updatedData = filteredData.map((item) =>
      item.maLopHoc === selectedRecord?.maLopHoc ? { ...selectedRecord, ...values } : item
    );
    setFilteredData(updatedData);
    setIsEditModalVisible(false);
    message.success('Sửa lớp học thành công!');
  };

  const handleUndo = () => {
    setSearchText('');
    message.info("Đã hoàn tác bộ lọc.");
  };

  const handleImportExcel = () => {
    message.info("Chức năng nhập từ Excel!");
  };

  const columns = [
    {
      title: 'Mã Lớp Học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
      width: '12%',
    },
    {
      title: 'Tên Lớp Học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
      width: '12%',
    },
    {
      title: 'Môn Học',
      dataIndex: 'tenMonHoc',
      key: 'tenMonHoc',
      width: '12%',
    },
    {
      title: 'Giảng Viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: '12%',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (ngayBatDau: string) => moment(ngayBatDau).format("DD/MM/YYYY"),
      width: '15%',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: '10%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        const color = trangThai === 'Có thể đăng ký' ? 'geekblue' : 'green';
        return <Tag color={color}>{trangThai}</Tag>;
      },
      width: '8%',
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: '10%',
    },
    {
      title: 'Quản lý',
      key: 'action',
      width: '8%',
      render: (_: any, record: LopHocType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>Xem và sửa thông tin</Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>Danh sách lớp</Menu.Item>
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
      <h1 className='page-name'>QUẢN LÝ LỚP HỌC</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Mã Lớp Học, Tên Lớp Học"
          onSearch={onSearch}
          enterButton
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="button-container">
          <Button className='custom-button' onClick={handleAddClass}>Thêm</Button>
          <Button className='custom-button' onClick={handleImportExcel}>Nhập Excel</Button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="maLopHoc"
        loading={loading}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />

      <ThemLopHocModal visible={isModalVisible} onCancel={handleCancel} onSubmit={handleOk} />

      <SuaLopHocModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord}
      />
    </Layout>
  );
};

export default LopHoc;
