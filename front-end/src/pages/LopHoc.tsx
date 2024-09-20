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
  { key: '1', maSo: '1', tieuDe: 'Chương trình IELTS 123', noiDung: '', tongSoBuoi: 30 },
  { key: '2', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '3', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '4', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '5', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '6', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '7', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
  { key: '8', maSo: 'IELTS1', tieuDe: 'Chương trình IELTS 1', noiDung: '', tongSoBuoi: 20 },
];

const sheet2Data: DataType[] = [
  { key: '3', maSo: 'CT2', tieuDe: 'Chương trình 2', noiDung: 'Môn này cực hot', tongSoBuoi: 24 },
  { key: '4', maSo: 'BE1', tieuDe: 'Business English 1', noiDung: '', tongSoBuoi: 24 },
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

const LopHoc: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Trang tính " key="1">
        <Table
          columns={getColumns(0)}  
          dataSource={sheet1Data}
          pagination={{ pageSize: 6 }}  
          rowKey="key"
        />
      </TabPane>
      <TabPane tab="Trang tính 2" key="2">
        <Table
          columns={getColumns(sheet1Data.length)}  // Bắt đầu từ độ dài của trang tính 1
          dataSource={sheet2Data}
          pagination={false}
          rowKey="key"
        />
      </TabPane>
    </Tabs>
  );
};

export default LopHoc;
