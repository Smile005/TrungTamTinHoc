import React, { useState } from 'react';
import { Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {TaiKhoanType} from '../types/TaiKhoanType'

const { Search } = Input;



const initialData: TaiKhoanType[] = [
  { key: '1', maNhanVien: 'NV001', phanQuyen: 1, trangThai: 'Hoạt động' },
  { key: '2', maNhanVien: 'NV002', phanQuyen: 2, trangThai: 'Hoạt động' },
  { key: '3', maNhanVien: 'NV003', phanQuyen: 3, trangThai: 'Đã khóa' },
  { key: '4', maNhanVien: 'NV004', phanQuyen: 1, trangThai: 'Hoạt động' },
  { key: '5', maNhanVien: 'NV005', phanQuyen: 2, trangThai: 'Đã khóa' },
];

// Cột của bảng
const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: TaiKhoanType, index: number) => startIndex + index + 1,  // Số thứ tự liên tục
  },
  {
    title: 'Mã Nhân Viên',
    dataIndex: 'maNhanVien',
    key: 'maNhanVien',
  },
  {
    title: 'Phân Quyền',
    dataIndex: 'phanQuyen',
    key: 'phanQuyen',
  },
  {
    title: 'Trạng Thái',
    dataIndex: 'trangThai',
    key: 'trangThai',
  },
  {
    title: 'Quản lý',
    key: 'action',
    render: (_: any, record: TaiKhoanType) => (
      <span>
        <Button type="link" icon={<EditOutlined />} />
        <Button type="link" icon={<DeleteOutlined />} />
      </span>
    ),
  },
];

const TaiKhoan: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  // Hàm tìm kiếm
  const onSearch = (value: string) => {
    const filtered = initialData.filter((item) =>
      item.maNhanVien.toLowerCase().includes(value.toLowerCase()) ||
      item.phanQuyen.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
      <Col span={24} className='col-header'>
          <h1 className='top-left-context'>Quản Lý Tài Khoản</h1>
          <Search
            placeholder="Tìm kiếm "
            onSearch={onSearch}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        columns={getColumns(0)}
        dataSource={filteredData}
        pagination={{ pageSize: 6 }}
        rowKey="key"
      />
    </>
  );
};

export default TaiKhoan;
