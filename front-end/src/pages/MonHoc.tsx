import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MonHocType } from '../types/MonHocType';
import ThemMonHocModal from '../components/ThemMonHocModal';
import SuaMonHocModal from '../components/SuaMonHocModal'; // Import modal sửa môn học
import '../styles/TableCustom.css';

const { Search } = Input;

// Dữ liệu mẫu đầy đủ
const initialData: MonHocType[] = [
  { key: '1', maMonHoc: 'MH001', tenMonHoc: 'Toán Cao Cấp', soBuoiHoc: 30, hocPhi: 1000000, moTa: 'Toán nâng cao cho sinh viên', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '2', maMonHoc: 'MH002', tenMonHoc: 'Lý thuyết đồ thị', soBuoiHoc: 25, hocPhi: 1200000, moTa: 'Môn học về lý thuyết đồ thị', trangThai: 'Tạm ngưng', ghiChu: 'Đang chỉnh sửa giáo trình' },
  { key: '3', maMonHoc: 'MH003', tenMonHoc: 'Giải tích', soBuoiHoc: 20, hocPhi: 900000, moTa: 'Toán giải tích', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '4', maMonHoc: 'MH004', tenMonHoc: 'Khoa học máy tính', soBuoiHoc: 35, hocPhi: 1500000, moTa: 'Khoa học máy tính căn bản', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '5', maMonHoc: 'MH005', tenMonHoc: 'Lập trình C', soBuoiHoc: 40, hocPhi: 1700000, moTa: 'Ngôn ngữ lập trình C', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '6', maMonHoc: 'MH006', tenMonHoc: 'Phân tích dữ liệu', soBuoiHoc: 50, hocPhi: 2000000, moTa: 'Kỹ thuật phân tích dữ liệu', trangThai: 'Tạm ngưng', ghiChu: '' },
  { key: '7', maMonHoc: 'MH007', tenMonHoc: 'Thị giác máy tính', soBuoiHoc: 45, hocPhi: 1800000, moTa: 'Nhập môn thị giác máy tính', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '8', maMonHoc: 'MH008', tenMonHoc: 'Xử lý ngôn ngữ tự nhiên', soBuoiHoc: 60, hocPhi: 2100000, moTa: 'Xử lý ngôn ngữ và văn bản', trangThai: 'Hoạt động', ghiChu: '' },
  { key: '9', maMonHoc: 'MH009', tenMonHoc: 'Điện tử số', soBuoiHoc: 55, hocPhi: 1900000, moTa: 'Điện tử số cơ bản', trangThai: 'Tạm ngưng', ghiChu: '' },
  { key: '10', maMonHoc: 'MH010', tenMonHoc: 'Vi mạch số', soBuoiHoc: 20, hocPhi: 1600000, moTa: 'Nhập môn vi mạch số', trangThai: 'Hoạt động', ghiChu: '' },
];

const MonHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<MonHocType[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MonHocType | null>(null);

  // Handle search input
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.soBuoiHoc?.toString().includes(value) ||
      item.hocPhi?.toString().includes(value) ||
      item.trangThai?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: MonHocType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    } else if (e.key === 'delete') {
      message.info(`Xóa môn học: ${record.tenMonHoc}`);
    }
  };

  const handleAddCourse = () => {
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
    message.success('Thêm mới môn học thành công!');
  };

  const handleEditSubmit = (values: any) => {
    const updatedData = filteredData.map((item) =>
      item.key === selectedRecord?.key ? { ...selectedRecord, ...values } : item
    );
    setFilteredData(updatedData);
    setIsEditModalVisible(false);
    message.success('Sửa môn học thành công!');
  };

  const handleUndo = () => {
    setFilteredData(initialData);
    setSearchText('');
    message.info('Đã hoàn tác bộ lọc.');
  };

  const handleImportExcel = () => {
    message.info('Chức năng nhập từ Excel!');
  };

  const columns = [
    {
      title: 'Mã Môn Học',
      dataIndex: 'maMonHoc',
      key: 'maMonHoc',
      width: '12%',
    },
    {
      title: 'Tên Môn Học',
      dataIndex: 'tenMonHoc',
      key: 'tenMonHoc',
      width: '20%',
    },
    {
      title: 'Số Buổi Học',
      dataIndex: 'soBuoiHoc',
      key: 'soBuoiHoc',
      width: '10%',
    },
    {
      title: 'Học Phí',
      dataIndex: 'hocPhi',
      key: 'hocPhi',
      width: '10%',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: '20%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        let color = trangThai === 'Hoạt động' ? 'geekblue' : 'green';
        return <Tag color={color} key={trangThai}>{trangThai.toUpperCase()}</Tag>;
      },
      width: '10%',
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
      width: '10%',
      render: (_: any, record: MonHocType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Xem và sửa thông tin
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
              Xóa
            </Menu.Item>
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
      <h1 className='page-name'>QUẢN LÝ MÔN HỌC</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Môn Học, Số Buổi Học"
          onSearch={onSearch}
          enterButton
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="button-container">
          <Button className='custom-button' onClick={handleUndo}>
            Hoàn tác
          </Button>
          <Button className='custom-button' onClick={handleAddCourse}>
            Thêm
          </Button>
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

      <ThemMonHocModal visible={isModalVisible} onCancel={handleCancel} onSubmit={handleOk} />

      <SuaMonHocModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord}
      />
    </Layout>
  );
};

export default MonHoc;
