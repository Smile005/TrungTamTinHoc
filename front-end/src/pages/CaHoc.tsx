import React, { useState } from 'react';
import { Table, Button, Input, Row, Col, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ThemCaHocModal from '../components/ThemCaHocModal'; 

const { Search } = Input;

interface DataType {
    key: string;
    maCa: string;
    batDau: string;
    ketThuc: string;
    trangThai: string;
}

const sheetData: DataType[] = [
    { key: '1', maCa: 'CA01', batDau: '08:00', ketThuc: '10:00', trangThai: 'Sẵn sàng' },
    { key: '2', maCa: 'CA02', batDau: '10:00', ketThuc: '12:00', trangThai: 'Sẵn sàng' },
    { key: '3', maCa: 'CA03', batDau: '13:00', ketThuc: '14:00', trangThai: 'Sẵn sàng' },
    { key: '4', maCa: 'CA04', batDau: '15:00', ketThuc: '18:00', trangThai: 'Sẵn sàng' },
    { key: '5', maCa: 'CA05', batDau: '18:00', ketThuc: '20:00', trangThai: 'Sẵn sàng' },
    { key: '6', maCa: 'CA06', batDau: '07:00', ketThuc: '09:00', trangThai: 'Chưa mở' },
];

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
        title: 'Thời Gian Bắt Đầu',
        dataIndex: 'batDau',
        key: 'batDau',
    },
    {
        title: 'Thời Gian Kết Thúc',
        dataIndex: 'ketThuc',
        key: 'ketThuc',
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
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onSearch = (value: string) => {
        setSearchText(value);

        const filteredSheet = sheetData.filter((item) =>
            item.maCa.toLowerCase().includes(value.toLowerCase()) ||
            item.batDau.toLowerCase().includes(value.toLowerCase()) ||
            item.ketThuc.toLowerCase().includes(value.toLowerCase()) ||
            item.trangThai.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredSheet);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Thêm ca học mới
    const handleAdd = (values: DataType) => {
        const newKey = (filteredData.length + 1).toString(); // Tạo key mới

        // Loại bỏ key khỏi values nếu có
        const { key, ...rest } = values;

        const newData = {
            key: newKey,  // Chỉ định key mới
            ...rest,      // Sao chép các thuộc tính khác từ values, ngoại trừ key
        };

        setFilteredData([...filteredData, newData]);
        message.success('Thêm ca học thành công!');
        handleCancel(); // Đóng modal sau khi thêm
    };


    return (
        <Row gutter={16}>
            <Col span={12} style={{ textAlign: 'left', marginTop: '20px', marginBottom: '35px' }}>
                <h1 className='top-left-context'>Quản Lý Ca Học</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Thêm Ca Học
                </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginTop: '92.5px'}}>
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

            {/* Modal thêm ca học */}
            <ThemCaHocModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleAdd} // Gọi hàm handleAdd khi submit form
            />
        </Row>
    );
};

export default CaHoc;
