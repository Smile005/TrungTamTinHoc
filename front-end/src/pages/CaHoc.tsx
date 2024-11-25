import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemCaHocModal from '../components/ThemCaHocModal';
import SuaCaHocModal from '../components/SuaCaHocModal';
import { CaHocType } from '../types/CaHocType';
import '../styles/TableCustom.css';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchCaHoc, deleteCaHoc } from '../store/slices/caHocSlice';

const { Search } = Input;

const CaHoc: React.FC = () => {
    const phanQuyen = useSelector((state: RootState) => state.auth.userInfo?.phanQuyen);
    const dispatch = useDispatch<AppDispatch>();
    const caHocState = useSelector((state: RootState) => state.caHoc);
    const { data: reduxData, loading: reduxLoading } = caHocState;

    const [searchText, setSearchText] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isThemCaModalVisible, setIsThemCaModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CaHocType | null>(null);
    const [data, setData] = useState<CaHocType[]>([]);

    useEffect(() => {
        dispatch(fetchCaHoc());
    }, [dispatch]);

    useEffect(() => {
        if (reduxData.length > 0) {
            setData(reduxData);
        }
    }, [reduxData]);

    const handleMenuClick = (e: any, record: CaHocType) => {
        if (e.key === 'edit') {
            setSelectedRecord(record);
            setIsEditModalVisible(true);
        } else if (e.key === 'delete') {
            if (record.maCa) {
                dispatch(deleteCaHoc(record.maCa))
                    .then(() => {
                        message.success('Xóa ca học thành công');
                    })
                    .catch(() => {
                        message.error('Lỗi khi xóa ca học');
                    });
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditSubmit = (values: any) => {
        console.log('Cập nhật thông tin ca học:', values);
        setIsEditModalVisible(false);
    };

    const handleAddCaHoc = (values: any) => {
        console.log('Thêm ca học mới:', values);
        setIsThemCaModalVisible(false);
    };

    const handleAddCancel = () => {
        setIsThemCaModalVisible(false);
    };

    const onSearch = (value: string) => {
        setSearchText(value);
    };

    const handleExportExcel = () => {
        if (data.length === 0) {
            message.warning('Không có dữ liệu để xuất');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'CaHoc');

        XLSX.writeFile(workbook, 'DanhSachCaHoc.xlsx');
        message.success('Xuất file Excel thành công');
    };

    const filteredData = data.filter((record) =>
        record.maCa.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Mã ca học',
            dataIndex: 'maCa',
            key: 'maCa',
            width: '10%',
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'batDau',
            key: 'batDau',
        },
        {
            title: 'Kết thúc',
            dataIndex: 'ketThuc',
            key: 'ketThuc',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (trangThai: string): JSX.Element => {
                let color = trangThai === 'Đang Hoạt Động' ? 'geekblue' : 'green';
                return (
                    <Tag color={color} key={trangThai}>
                        {trangThai}
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
            render: (_: any, record: CaHocType) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="edit" icon={<EditOutlined />}>Xem và sửa thông tin</Menu.Item>
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

    const hasPermission = phanQuyen === 0 || phanQuyen === 1 || phanQuyen === 2;
    if (!hasPermission) {
      return <div>Bạn không có quyền truy cập trang này.</div>;
    }

    return (
        <Layout>
            <h1 className='page-name'>QUẢN LÝ CA HỌC</h1>
            <div className="button-container">
                <Search
                    className="custom-search"
                    placeholder="Nhập mã ca học"
                    onSearch={onSearch}
                    enterButton
                    style={{ backgroundColor: '#fff' }}
                />
                <div className="button-container">
                    <Button className='custom-button' onClick={() => setIsThemCaModalVisible(true)}>
                        Thêm Ca Học
                    </Button>
                    <Button className='custom-button' onClick={handleExportExcel}>
                        Xuất Excel
                    </Button>
                </div>
            </div>
            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredData.length ? filteredData : data}
                pagination={{ pageSize: 5 }}
                loading={reduxLoading}
                style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
            />

            <ThemCaHocModal
                visible={isThemCaModalVisible}
                onCancel={handleAddCancel}
                onSubmit={handleAddCaHoc}
            />

            <SuaCaHocModal
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                onSubmit={handleEditSubmit}
                initialValues={selectedRecord}
            />
        </Layout>
    );
};

export default CaHoc;
