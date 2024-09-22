import React, { useState } from 'react';
import { Tabs, Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search } = Input;

interface MonHocDataType {
  key: string;
  maMonHoc: string;
  tenMonHoc: string;
  soBuoiHoc: number;
  hocPhi: number;
  moTa: string;
  trangThai: string;
  ghiChu: string;
}

// Dữ liệu mẫu cho các trang tính khác nhau
const sheet1Data: MonHocDataType[] = [
  { key: '1', maMonHoc: 'MH01', tenMonHoc: 'DOT.net', soBuoiHoc: 30, hocPhi: 5000000, moTa: '', trangThai: 'Đang mở', ghiChu: '' },
  { key: '2', maMonHoc: 'MH02', tenMonHoc: 'Java nâng cao', soBuoiHoc: 20, hocPhi: 4500000, moTa: '', trangThai: 'Đang mở', ghiChu: '' },
  { key: '3', maMonHoc: 'MH03', tenMonHoc: 'PHP Tổng hợp', soBuoiHoc: 24, hocPhi: 4000000, moTa: 'Môn này cực hot', trangThai: 'Đang mở', ghiChu: '' },
  { key: '4', maMonHoc: 'MH04', tenMonHoc: 'JS và lập trình trên thiết bị di động', soBuoiHoc: 24, hocPhi: 5000000, moTa: '', trangThai: 'Đang mở', ghiChu: '' },
  // Thêm dữ liệu khác
];

const sheet2Data: MonHocDataType[] = [
  { key: '1', maMonHoc: 'MH03', tenMonHoc: 'Microsoft Office nâng cao', soBuoiHoc: 24, hocPhi: 3000000, moTa: 'Môn này cực hot', trangThai: 'Đang mở', ghiChu: '' },
  { key: '2', maMonHoc: 'MH04', tenMonHoc: 'Tin học văn phòng phổ thông', soBuoiHoc: 24, hocPhi: 2500000, moTa: '', trangThai: 'Đang mở', ghiChu: '' },
];

// Cột của bảng
const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: MonHocDataType, index: number) => startIndex + index + 1,  // Số thứ tự liên tục
  },
  {
    title: 'Mã Môn Học',
    dataIndex: 'maMonHoc',
    key: 'maMonHoc',
  },
  {
    title: 'Tên Môn Học',
    dataIndex: 'tenMonHoc',
    key: 'tenMonHoc',
  },
  {
    title: 'Số Buổi Học',
    dataIndex: 'soBuoiHoc',
    key: 'soBuoiHoc',
  },
  {
    title: 'Học Phí',
    dataIndex: 'hocPhi',
    key: 'hocPhi',
  },
  {
    title: 'Mô Tả',
    dataIndex: 'moTa',
    key: 'moTa',
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
    render: (_: any, record: MonHocDataType) => (
      <span>
        <Button type="link" icon={<EditOutlined />} />
        <Button type="link" icon={<DeleteOutlined />} />
      </span>
    ),
  },
];

const MonHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData1, setFilteredData1] = useState(sheet1Data);
  const [filteredData2, setFilteredData2] = useState(sheet2Data);

  // Hàm tìm kiếm
  const onSearch = (value: string) => {
    const filteredSheet1 = sheet1Data.filter((item) =>
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.moTa.toLowerCase().includes(value.toLowerCase()) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );

    const filteredSheet2 = sheet2Data.filter((item) =>
      item.maMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenMonHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.moTa.toLowerCase().includes(value.toLowerCase()) ||
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
          <h1 className='top-left-context'>Quản Lý Môn Học</h1>
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
        <TabPane tab="DS1" key="1">
          <Table
            columns={getColumns(0)}  
            dataSource={filteredData1}
            pagination={{ pageSize: 5 }}  
            rowKey="key"
          />
        </TabPane>
        <TabPane tab="DS2" key="2">
          <Table
            columns={getColumns(filteredData1.length)}  
            dataSource={filteredData2}
            pagination={{ pageSize: 5 }}  
            rowKey="key"
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default MonHoc;
