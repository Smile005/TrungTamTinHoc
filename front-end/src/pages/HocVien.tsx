import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { HocVienType } from '../types/HocVienType';
import ThemHocVienModal from '../components/ThemHocVienModal';
import SuaHocVienModal from '../components/SuaHocVienModal';
import '../styles/TableCustom.css';
import ImportExcelModal from '../components/ImportExcelModal';
import axios from 'axios';
import moment from 'moment';
import { Key } from 'antd/es/table/interface'; // Import Key từ Ant Design

const { Search } = Input;

const HocVien: React.FC = () => {
    const [isThemHocVienModalVisible, setIsThemHocVienModalVisible] = useState(false);
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<HocVienType | null>(null);
    const [data, setData] = useState<HocVienType[]>([]); 
    const [filteredData, setFilteredData] = useState<HocVienType[]>([]); 
    const [loading, setLoading] = useState<boolean>(false); 

    const fetchHocVien = async () => {
        setLoading(true); 
        try {
            const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            });
            setData(response.data); 
            setFilteredData(response.data); 
        } catch (error) {
            console.error('Lỗi khi lấy danh sách học viên:', error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchHocVien();
    }, []);

    const handleMenuClick = (e: any, record: HocVienType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        } else if (e.key === 'delete') {
            deleteHocVien(record.maHocVien); // Gọi hàm xóa học viên
        }
    };

    const showHocVienModal = () => {
        setIsThemHocVienModalVisible(true);
    };

    const showImportModal = (type: 'hocvien' | 'nhanvien') => {
        setIsImportModalVisible(true);
    };

    const handleThemHocVien = (hocVien: HocVienType) => {
        fetchHocVien();
        setIsThemHocVienModalVisible(false); 
    };

    const handleSuaHocVien = (hocVien: HocVienType) => {
        fetchHocVien();
        setIsEditModalVisible(false); 
    };

    const handleCancel = () => {
        setIsThemHocVienModalVisible(false);
        setIsEditModalVisible(false);
        setIsImportModalVisible(false);
    };

    const onSearch = (value: string) => {
        const filtered = data.filter((item) =>
            item.tenHocVien?.toLowerCase().includes(value.toLowerCase()) ||
            item.maHocVien?.toLowerCase().includes(value.toLowerCase()) ||
            item.email?.toLowerCase().includes(value.toLowerCase()) ||
            item.sdt?.toLowerCase().includes(value.toLowerCase()) ||
            item.tinhTrang?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered); 
    };

    // Hàm xóa học viên
    const deleteHocVien = async (maHocVien: string | undefined) => {
        if (!maHocVien) {
            message.error('Không thể xóa: Mã học viên không hợp lệ.');
            return;
        }

        try {
            await axios.post('http://localhost:8081/api/hocvien/xoa-hocvien', 
                { maHocVien }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            message.success('Xóa học viên thành công');
            fetchHocVien(); // Tải lại danh sách sau khi xóa
        } catch (error) {
            console.error('Lỗi khi xóa học viên:', error);
            message.error('Lỗi khi xóa học viên');
        }
    };

    const columns = [
        {
            title: 'Mã học viên',
            dataIndex: 'maHocVien',
            key: 'maHocVien',
            width: '10%',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'tenHocVien',
            key: 'tenHocVien',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            width: '8%',
            filters: [
                { text: 'Nam', value: 'Nam' },
                { text: 'Nữ', value: 'Nữ' },
                { text: 'Undefined', value: 'Undefined' },
            ],
            // Định nghĩa kiểu cho `value` và `record`
            onFilter: (value: Key | boolean, record: HocVienType) => {
                if (value === 'Undefined') {
                    return record.gioiTinh === undefined;
                }
                if (record.gioiTinh === undefined) return false;
                return record.gioiTinh.indexOf(value as string) === 0;
            },
            render: (gioiTinh: string | undefined): JSX.Element => {
                let color = gioiTinh === 'Nam' ? 'geekblue' : 'volcano';
                return (
                    <Tag color={color} key={gioiTinh}>
                        {gioiTinh ? gioiTinh : 'Undefined'}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày vào học',
            dataIndex: 'ngayVaoHoc',
            key: 'ngayVaoHoc',
            width: '10%',
            render: (ngayVaoHoc: string) => {
              return ngayVaoHoc ? moment(ngayVaoHoc).format('DD/MM/YYYY') : 'Chưa có ngày';
            }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            width: '6%',
            filters: [
                { text: 'Chưa đăng ký', value: 'Chưa đăng ký' },
                { text: 'Đang học', value: 'Đang học' },
                { text: 'Đã tốt nghiệp', value: 'Đã tốt nghiệp' },
            ],
            // Sửa kiểu dữ liệu `value` thành `Key | boolean`
            onFilter: (value: Key | boolean, record: HocVienType) => record.tinhTrang?.indexOf(value as string) === 0,
            render: (tinhTrang: string): JSX.Element => {
                let color = '';
                if (tinhTrang === 'Đang Học') {
                    color = 'geekblue';
                } else if (tinhTrang === 'Đã Tốt Nghiệp') {
                    color = 'green';
                } else if (tinhTrang === 'Chưa Đăng Ký') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={tinhTrang}>
                        {tinhTrang}
                    </Tag>
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Quản lý',
            key: 'action',
            width: '8%',
            render: (_: any, record: HocVienType) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="edit" icon={<EditOutlined />}>Xem và sửa thông tin</Menu.Item>
                        <Menu.Item key="dangKy" icon={<FormOutlined />}>Đăng ký</Menu.Item>
                        <Menu.Item key="delete" icon={<DeleteOutlined />}>Xóa</Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu}>
                        <Button type="link" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <Layout>
            <h1 className='page-name'>QUẢN LÝ HỌC VIÊN</h1>
            <div className="button-container">
                <Search
                    className="custom-search"
                    placeholder="Nhập tên học viên, mã học viên, email hoặc số điện thoại"
                    onSearch={onSearch} 
                    enterButton
                />
                <div className="button-container">
                    <Button className='custom-button' onClick={showHocVienModal}>Thêm</Button>
                    <Button className='custom-button' onClick={() => showImportModal('hocvien')}>
                        Nhập Excel
                    </Button>
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                loading={loading} 
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <ThemHocVienModal
                visible={isThemHocVienModalVisible}
                onCancel={handleCancel}
                onSubmit={handleThemHocVien}
            />

            <SuaHocVienModal
                visible={isEditModalVisible}
                onCancel={handleCancel}
                onOk={handleSuaHocVien}
                initialValues={selectedRecord || {} as HocVienType}
            />

            <ImportExcelModal
                visible={isImportModalVisible}
                onCancel={handleCancel}
                modalType="hocvien"
            />
        </Layout>
    );
};

export default HocVien;
