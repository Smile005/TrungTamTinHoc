import React, { useState } from 'react';
import {  Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/TableCustom.css';

const { Search } = Input;

interface DataType {
  key: string;
  maPhong: string;
  soLuong: number;
  trangThai: string;
}

// Dữ liệu mẫu cho các trang tính khác nhau
const sheet1Data: DataType[] = [
  { key: '1', maPhong: 'PHA01', soLuong: 45, trangThai: 'Sẵn sàng' },
  { key: '2', maPhong: 'PHA02', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '3', maPhong: 'PHA03', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '4', maPhong: 'PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '5', maPhong: 'PHA05', soLuong: 40, trangThai: 'Sẵn sàng' },
];


// Cột của bảng
const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: DataType, index: number) => startIndex + index + 1,
  },
  {
    title: 'Mã Phòng',
    dataIndex: 'maPhong',
    key: 'maPhong',
  },
  {
    title: 'Số Lượng',
    dataIndex: 'soLuong',
    key: 'soLuong',
  },
  {
    title: 'Trạng Thái',
    dataIndex: 'trangThai',
    key: 'trangThai',
  },
  {
    title: 'Quản lý',
    key: 'action',
    render: (_: any, record: DataType) => (
      <span>
        <Button type="link" icon={<EditOutlined />} />
        <Button type="link" icon={<DeleteOutlined />} />
      </span>
    ),
  },
];

const PhongHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData1, setFilteredData1] = useState(sheet1Data);

  const onSearch = (value: string) => {
    setSearchText(value);

    // Lọc dữ liệu của Dãy A và Dãy B dựa trên tìm kiếm (mã phòng, số lượng, trạng thái)
    const filteredSheet1 = sheet1Data.filter((item) =>
      item.maPhong.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuong.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );


    setFilteredData1(filteredSheet1);
  };

  return (
    <Row gutter={16}>
      <Col span={24} className='col-header'>
        <h1 className='top-left-context'>Quản Lý Phòng Học</h1>
        <Search
          placeholder="Tìm kiếm mã phòng, số lượng, trạng thái"
          onSearch={onSearch}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>
      <Col span={24}>
        <Table
          columns={getColumns(0)}
          dataSource={filteredData1}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </Col>
    </Row>
  );
};

export default PhongHoc;
