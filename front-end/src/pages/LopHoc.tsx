import React, { useState } from 'react';
import {  Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {LopHocType} from '../types/LopHocType'

const { Search } = Input;

const sheet1Data: LopHocType[] = [
  { key: '1', maLopHoc: 'LH001', tenLopHoc: 'Lớp A', maMonHoc: 'MH001', maGiaoVien: 'GV001', ngayBatDau: '2023-09-22', soLuong: '30', trangThai: 'Còn trống', ghiChu: '' },
  { key: '2', maLopHoc: 'LH002', tenLopHoc: 'Lớp B', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '3', maLopHoc: 'LH002', tenLopHoc: 'Lớp C', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '4', maLopHoc: 'LH002', tenLopHoc: 'Lớp D', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '5', maLopHoc: 'LH002', tenLopHoc: 'Lớp E', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
];

const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: LopHocType, index: number) => startIndex + index + 1,  
  },
  {
    title: 'Mã Lớp Học',
    dataIndex: 'maLopHoc',
    key: 'maLopHoc',
  },
  {
    title: 'Tên Lớp Học',
    dataIndex: 'tenLopHoc',
    key: 'tenLopHoc',
  },
  {
    title: 'Mã Môn Học',
    dataIndex: 'maMonHoc',
    key: 'maMonHoc',
  },
  {
    title: 'Mã Giáo Viên',
    dataIndex: 'maGiaoVien',
    key: 'maGiaoVien',
  },
  {
    title: 'Ngày Bắt Đầu',
    dataIndex: 'ngayBatDau',
    key: 'ngayBatDau',
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
    title: 'Ghi Chú',
    dataIndex: 'ghiChu',
    key: 'ghiChu',
  },
  {
    title: 'Quản lý',
    key: 'action',
    render: (_: any, record: LopHocType) => (
      <span>
        <Button type="link" icon={<EditOutlined />} />
        <Button type="link" icon={<DeleteOutlined />} />
      </span>
    ),
  },
];

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData1, setFilteredData1] = useState(sheet1Data);

  const onSearch = (value: string) => {
    const filteredSheet1 = sheet1Data.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maGiaoVien.toLowerCase().includes(value.toLowerCase()) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData1(filteredSheet1);
    setSearchText(value);
  };

  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={24} style={{ textAlign: 'right', marginTop: '20px' }}>
          <h1 className='top-left-context'>Quản Lý Lớp Học</h1>
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
            dataSource={filteredData1}
            pagination={{ pageSize: 5 }}
            rowKey="key"
          />
    </>
  );
};

export default LopHoc;
