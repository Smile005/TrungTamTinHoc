import React, { useState } from 'react';
import { Table, Button, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/TableCustom.css';

const { Search } = Input;

interface DataType {
    key: string;
    maCa: string;
    thoiGian: string;
    trangThai: string;
}

const sheetData: DataType[] = [
    { key: '1', maCa: 'CA01', thoiGian: '08:00 - 10:00', trangThai: 'Sẵn sàng' },
    { key: '2', maCa: 'CA02', thoiGian: '10:00 - 12:00', trangThai: 'Sẵn sàng' },
    { key: '3', maCa: 'CA03', thoiGian: '13:00 - 15:00', trangThai: 'Sẵn sàng' },
    { key: '4', maCa: 'CA04', thoiGian: '15:00 - 17:00', trangThai: 'Sẵn sàng' },
    { key: '5', maCa: 'CA05', thoiGian: '18:00 - 20:00', trangThai: 'Sẵn sàng' },
    { key: '6', maCa: 'CA06', thoiGian: '20:00 - 22:00', trangThai: 'Chưa mở' },
];

// Cột của bảng
const getColumns = (startIndex: number) => [
    {
        title: 'STT',
        key: 'stt',
        render: (_: any, __: DataType, index: number) => startIndex + index + 1,
    },
    {
        title: 'Mã Ca',
        dataIndex: 'maCa',
        key: 'maCa',
    },
    {
        title: 'Thời Gian',
        dataIndex: 'thoiGian',
        key: 'thoiGian',
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

const CaHoc: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(sheetData);

    const onSearch = (value: string) => {
        setSearchText(value);

        const filteredSheet = sheetData.filter((item) =>
            item.maCa.toLowerCase().includes(value.toLowerCase()) ||
            item.thoiGian.toLowerCase().includes(value.toLowerCase()) ||
            item.trangThai.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredSheet);
    };

    return (
        <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'right', marginTop: '20px', marginBottom: '35px' }}>
                <h1 className='top-left-context'>Quản Lý Ca Học</h1>
                <Search
                    placeholder="Tìm kiếm mã ca, thời gian, trạng thái"
                    onSearch={onSearch}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                    className='search-cate'
                />
            </Col>
            <Col span={24}>
                <Table
                    columns={getColumns(0)}
                    dataSource={filteredData}
                    pagination={{ pageSize: 5 }}
                    rowKey="key"
                />
            </Col>
        </Row>
    );
};

export default CaHoc;
