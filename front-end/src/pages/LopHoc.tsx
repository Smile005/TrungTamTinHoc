import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'; // Import axios để gọi API
import { LopHocType } from '../types/LopHocType';
import moment from 'moment';
import ThemLopHocModal from '../components/ThemLopHocModal';
import SuaLopHocModal from '../components/SuaLopHocModal';
import '../styles/TableCustom.css';

const { Search } = Input;

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); 
  const [filteredData, setFilteredData] = useState<LopHocType[]>([]); // Dữ liệu từ API
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState<LopHocType | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading

  // Gọi API để lấy danh sách lớp học
  useEffect(() => {
    const fetchLopHoc = async () => {
      setLoading(true); // Hiển thị trạng thái loading
      try {
        const response = await axios.get('http://localhost:8081/api/lophoc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Thay token bằng token thực tế của bạn
          },
        });
        setFilteredData(response.data); // Lưu dữ liệu lớp học vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách lớp học:', error);
        message.error('Lỗi khi lấy danh sách lớp học!');
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchLopHoc();
  }, []);

  // Xử lý tìm kiếm
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
      item.key === selectedRecord?.key ? { ...selectedRecord, ...values } : item
    );
    setFilteredData(updatedData);
    setIsEditModalVisible(false);
    message.success('Sửa lớp học thành công!');
  };

  const handleUndo = () => {
    setSearchText(''); // Xóa bộ lọc tìm kiếm
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
      title: 'Mã Môn Học',
      dataIndex: 'maMonHoc',
      key: 'maMonHoc',
      width: '12%',
    },
    {
      title: 'Mã Giảng Viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
      width: '12%',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
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
          <Button className='custom-button' onClick={handleUndo}>Hoàn tác</Button>
          <Button className='custom-button' onClick={handleAddClass}>Thêm</Button>
          <Button className='custom-button' onClick={handleImportExcel}>
            Nhập Excel
          </Button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        loading={loading} // Hiển thị trạng thái loading
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
