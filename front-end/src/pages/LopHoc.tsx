import React, { useState } from 'react';
import { Tabs, Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search } = Input;

interface LopHocDataType {
  key: string;
  maLopHoc: string;
  tenLopHoc: string;
  maMonHoc: string;
  maGiaoVien: string;
  ngayBatDau: string; // date dưới dạng chuỗi
  soLuong: string;
  trangThai: string;
  ghiChu: string;
}

const sheet1Data: LopHocDataType[] = [
  { key: '1', maLopHoc: 'LH001', tenLopHoc: 'Lớp A', maMonHoc: 'MH001', maGiaoVien: 'GV001', ngayBatDau: '2023-09-22', soLuong: '30', trangThai: 'Còn trống', ghiChu: '' },
  { key: '2', maLopHoc: 'LH002', tenLopHoc: 'Lớp B', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '3', maLopHoc: 'LH002', tenLopHoc: 'Lớp C', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '4', maLopHoc: 'LH002', tenLopHoc: 'Lớp D', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
  { key: '5', maLopHoc: 'LH002', tenLopHoc: 'Lớp E', maMonHoc: 'MH002', maGiaoVien: 'GV002', ngayBatDau: '2023-09-22', soLuong: '25', trangThai: 'Đang hoạt động', ghiChu: '' },
];

const sheet2Data: LopHocDataType[] = [
  { key: '3', maLopHoc: 'LH003', tenLopHoc: 'Lớp C', maMonHoc: 'MH003', maGiaoVien: 'GV003', ngayBatDau: '2023-09-22', soLuong: '20', trangThai: 'Còn trống', ghiChu: '' },
  { key: '4', maLopHoc: 'LH004', tenLopHoc: 'Lớp D', maMonHoc: 'MH004', maGiaoVien: 'GV004', ngayBatDau: '2023-09-22', soLuong: '30', trangThai: 'Đang hoạt động', ghiChu: '' },
  
];

const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: LopHocDataType, index: number) => startIndex + index + 1,  // Số thứ tự liên tục
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
    render: (_: any, record: LopHocDataType) => (
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
  const [filteredData2, setFilteredData2] = useState(sheet2Data);

  const onSearch = (value: string) => {
    const filteredSheet1 = sheet1Data.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maGiaoVien.toLowerCase().includes(value.toLowerCase()) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );

    const filteredSheet2 = sheet2Data.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.maGiaoVien.toLowerCase().includes(value.toLowerCase()) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData1(filteredSheet1);
    setFilteredData2(filteredSheet2);
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách lớp 1" key="1">
          <Table
            columns={getColumns(0)}
            dataSource={filteredData1}
            pagination={{ pageSize: 5 }}
            rowKey="key"
          />
        </TabPane>
        <TabPane tab="Danh sách lớp 2" key="2">
          <Table
            columns={getColumns(filteredData1.length)}  
            dataSource={filteredData2}
            pagination={false}
            rowKey="key"
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default LopHoc;
