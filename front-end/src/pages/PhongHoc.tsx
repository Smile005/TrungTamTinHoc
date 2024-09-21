import React from 'react';
import { Tabs, Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface DataType {
  key: string;
  maPhong: string;
  soLuong: number;
  trangThai: string;
}

// Dữ liệu mẫu cho các trang tính khác nhau
const sheet1Data: DataType[] = [
  { key: '1', maPhong: ' PHA01', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '2', maPhong: ' PHA02', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '3', maPhong: ' PHA03', soLuong: 40, trangThai: 'Sẵn sàng'  },
  { key: '4', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '5', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '6', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '7', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '8', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '9', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '10', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },
  { key: '11', maPhong: ' PHA04', soLuong: 40, trangThai: 'Sẵn sàng' },

];

const sheet2Data: DataType[] = [
  { key: '1', maPhong: ' PHB03', soLuong: 40, trangThai: 'Chưa mở'  },
  { key: '2', maPhong: ' PHB04', soLuong: 40, trangThai: 'Sẵn sàng' },
];

// Cột của bảng
const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: DataType, index: number) => startIndex + index + 1,  // Số thứ tự liên tục
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

const LopHoc: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Dãy A" key="1">
        <Table
          columns={getColumns(0)}  
          dataSource={sheet1Data}
          pagination={{ pageSize: 6 }}  
          rowKey="key"
        />
      </TabPane>
      <TabPane tab="Dãy B" key="2">
        <Table
          columns={getColumns(sheet1Data.length)}  
          dataSource={sheet2Data}
          pagination={{ pageSize: 6 }}  
          rowKey="key"
        />
      </TabPane>
    </Tabs>
  );
};

export default LopHoc;
