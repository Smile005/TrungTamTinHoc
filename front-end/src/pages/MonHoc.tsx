import React from 'react';
import { Tabs, Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface DataType {
  key: string;
  maSo: string;
  tieuDe: string;
  noiDung: string;
  tongSoBuoi: number;
}

// Dữ liệu mẫu cho các trang tính khác nhau
const sheet1Data: DataType[] = [
  { key: '1', maSo: 'MH01', tieuDe: 'DOT.net', noiDung: '', tongSoBuoi: 30 },
  { key: '2', maSo: 'MH02', tieuDe: 'Java nâng cao', noiDung: '', tongSoBuoi: 20 },
  { key: '3', maSo: 'MH03', tieuDe: 'PHP Tổng hợp', noiDung: 'Môn này cực hot', tongSoBuoi: 24 },
  { key: '4', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '5', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '6', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '7', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '8', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '9', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '10', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },
  { key: '11', maSo: 'MH04', tieuDe: 'JS và lập trình trên thiết bị di động', noiDung: '', tongSoBuoi: 24 },

];

const sheet2Data: DataType[] = [
  { key: '1', maSo: 'MH03', tieuDe: 'Microsoft Office nâng cao', noiDung: 'Môn này cực hot', tongSoBuoi: 24 },
  { key: '2', maSo: 'MH04', tieuDe: 'Tin học văn phòng phổ thông', noiDung: '', tongSoBuoi: 24 },
];

// Cột của bảng
const getColumns = (startIndex: number) => [
  {
    title: 'STT',
    key: 'stt',
    render: (_: any, __: DataType, index: number) => startIndex + index + 1,  // Số thứ tự liên tục
  },
  {
    title: 'Mã số',
    dataIndex: 'maSo',
    key: 'maSo',
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'tieuDe',
    key: 'tieuDe',
  },
  {
    title: 'Nội dung',
    dataIndex: 'noiDung',
    key: 'noiDung',
  },
  {
    title: 'Tổng số buổi',
    dataIndex: 'tongSoBuoi',
    key: 'tongSoBuoi',
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

const MonHoc: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Lập trình" key="1">
        <Table
          columns={getColumns(0)}  
          dataSource={sheet1Data}
          pagination={{ pageSize: 6 }}  
          rowKey="key"
        />
      </TabPane>
      <TabPane tab="Tin học văn phòng" key="2">
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

export default MonHoc;
