import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { LopHocType } from '../types/LopHocType';
import moment from 'moment';
import ThemLopHocModal from '../components/ThemLopHocModal';
import SuaLopHocModal from '../components/SuaLopHocModal'; 
import '../styles/TableCustom.css';

const { Search } = Input;

const initialData: LopHocType[] = [
  { key: '1', maLopHoc: 'LH001', tenLopHoc: 'Lớp A', maMonHoc: 'MH001', maGiangVien: 'GV001', ngayBatDau: moment('2023-09-22').format('DD/MM/YYYY'), soLuong: '30', trangThai: 'Tạm ngưng', ghiChu: '', },
  { key: '2', maLopHoc: 'LH002', tenLopHoc: 'Lớp B', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: moment('2023-09-22').format('DD/MM/YYYY'), soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '3', maLopHoc: 'LH002', tenLopHoc: 'Lớp C', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: moment('2023-09-22').format('DD/MM/YYYY'), soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '4', maLopHoc: 'LH002', tenLopHoc: 'Lớp D', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: moment('2023-09-22').format('DD/MM/YYYY'), soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '5', maLopHoc: 'LH002', tenLopHoc: 'Lớp E', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: moment('2023-09-22').format('DD/MM/YYYY'), soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '6', maLopHoc: 'LH003', tenLopHoc: 'Lớp Toán 12A', maMonHoc: 'MH001', maGiangVien: 'GV001', ngayBatDau: moment('2024-01-10').format('DD/MM/YYYY'), soLuong: '30', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '7', maLopHoc: 'LH004', tenLopHoc: 'Lớp Lý thuyết đồ thị', maMonHoc: 'MH002', maGiangVien: 'GV002', ngayBatDau: moment('2024-02-12').format('DD/MM/YYYY'), soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '', },
  { key: '8', maLopHoc: 'LH005', tenLopHoc: 'Lớp Giải tích 11B', maMonHoc: 'MH003', maGiangVien: 'GV001', ngayBatDau: moment('2024-03-15').format('DD/MM/YYYY'), soLuong: '28', trangThai: 'Đang hoạt động', ghiChu: 'Ghi chú về lớp', },
  { key: '9', maLopHoc: 'LH006', tenLopHoc: 'Lớp Khoa học máy tính', maMonHoc: 'MH004', maGiangVien: 'GV003', ngayBatDau: moment('2024-04-20').format('DD/MM/YYYY'), soLuong: '35', trangThai: 'Tạm ngưng', ghiChu: 'Chờ học viên mới', },
  { key: '10', maLopHoc: 'LH007', tenLopHoc: 'Lớp Lập trình C cơ bản', maMonHoc: 'MH005', maGiangVien: 'GV004', ngayBatDau: moment('2024-05-01').format('DD/MM/YYYY'), soLuong: '20', trangThai: 'Đang hoạt động', ghiChu: '', },
];

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState(''); 
  const [filteredData, setFilteredData] = useState<LopHocType[]>(initialData); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState<LopHocType | null>(null);

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
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
    setFilteredData(initialData);
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
      title: 'Mã Môn Học',
      dataIndex: 'maMonHoc',
      key: 'maMonHoc',
      width: '12%',
    },
    {
      title: 'Mã Giảng Viên',
      dataIndex: 'maGiangVien',
      key: 'maGiangVien',
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
        let color = trangThai === 'Đang hoạt động' ? 'geekblue' : 'green' ;
        return <Tag color={color} key={trangThai}>{trangThai.toUpperCase()}</Tag>;
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
