import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message, Modal } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, OrderedListOutlined, FileAddOutlined, ContactsOutlined, SnippetsOutlined, DiffOutlined } from '@ant-design/icons';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';
import SuaLopHocModal from '../components/SuaLopHocModal';
import ThemBuoiHocModal from '../components/ThemBuoiHoc';
import ThemLichThiModal from '../components/ThemLichThi';
import AddLopHoc from '../components/AddLopHoc';
import { useNavigate } from 'react-router-dom';
import '../styles/TableCustom.css';
import moment from 'moment';
import * as XLSX from 'xlsx';
import ThemLichHoc from '../components/ThemLichHoc';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { Search } = Input;

const LopHoc: React.FC = () => {
  const phanQuyen = useSelector((state: RootState) => state.auth.userInfo?.phanQuyen);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<LopHocType[]>([]);
  const [filteredData, setFilteredData] = useState<LopHocType[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isThemLichHocVisible, setIsThemLichHocVisible] = useState(false);
  const [isThemBuoiHocVisible, setIsThemBuoiHocVisible] = useState(false);
  const [isThemLichThiVisible, setIsThemLichThiVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LopHocType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchLopHocData = async () => {
    setLoading(true);
    try {
      const lopHocResponse = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setData(lopHocResponse.data);
      setFilteredData(lopHocResponse.data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      message.error('Lỗi khi lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLopHocData();
  }, []);

  const onSearch = (value: string) => {
    const filtered = data.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.soLuongMax.toString().includes(value) ||
      item.trangThai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleMenuClick = (e: any, record: LopHocType) => {
    if (e.key === 'edit') {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    } else if (e.key === 'danhSachLop') {
      navigate(`/ds-hoc-vien-lop/${record.maLopHoc}`);
    } else if (e.key === 'themLichHoc') {
      setSelectedRecord(record);
      setIsThemLichHocVisible(true);
    } else if (e.key === 'themBuoiHoc') {
      setSelectedRecord(record);
      setIsThemBuoiHocVisible(true);
    } else if (e.key === 'themLichThi') {
      setSelectedRecord(record);
      setIsThemLichThiVisible(true);
    } else if (e.key === 'nhapDiem') {
      navigate(`/nhapdiem/${record.maLopHoc}`);
    } else if (e.key === 'delete') {
      deleteLopHoc(record.maLopHoc);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
    setIsThemLichHocVisible(false);
    setIsThemBuoiHocVisible(false);
    setIsThemLichThiVisible(false);
  };

  const onEditSubmit = (values: LopHocType) => {
    const updatedData = data.map((item) =>
      item.maLopHoc === values.maLopHoc ? { ...item, ...values } : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
    message.success('Cập nhật lớp học thành công');
    setIsEditModalVisible(false);
  };

  const deleteLopHoc = async (maLopHoc: string | undefined) => {
    if (!maLopHoc) {
      message.error('Không thể xóa: Mã lớp học không hợp lệ.');
      return;
    }

    try {
      await axios.post('http://localhost:8081/api/lophoc/xoa-lophoc',
        { maLopHoc },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success('Xóa lớp học thành công');
      fetchLopHocData();
    } catch (error) {
      console.error('Lỗi khi xóa lớp học:', error);
      message.error('Lỗi khi xóa lớp học');
    }
  };

  const exportLopHocToExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/lophoc/xuat-lophoc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'arraybuffer',
      });

      const workbook = XLSX.read(response.data, { type: 'array' });
      XLSX.writeFile(workbook, 'DanhSachLopHoc.xlsx');
      message.success('Xuất danh sách lớp học thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất danh sách lớp học:', error);
      message.error('Xuất danh sách lớp học không thành công');
    }
  };

  const columns = [
    {
      title: 'Mã Lớp Học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
      width: '12%',
    },
    {
      title: 'Tên Lớp Học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
      width: '12%',
    },
    {
      title: 'Môn Học',
      dataIndex: 'tenMonHoc',
      key: 'tenMonHoc',
      width: '12%',
    },
    {
      title: 'Giảng Viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: '12%',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (ngayBatDau: string) => moment(ngayBatDau).format('DD/MM/YYYY'),
      width: '15%',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuongMax',
      key: 'soLuongMax',
      width: '10%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string): JSX.Element => {
        const color = trangThai === 'Có thể đăng ký' ? 'geekblue' : 'green';
        return <Tag color={color}>{trangThai}</Tag>;
      },
      width: '8%',
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: '10%',
    },
    {
      title: 'Quản lý',
      key: 'action',
      width: '8%',
      render: (_: any, record: LopHocType) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Xem và sửa thông tin
            </Menu.Item>
            <Menu.Item key="danhSachLop" icon={<OrderedListOutlined />}>
              Danh sách lớp
            </Menu.Item>
            <Menu.Item key="themLichHoc" icon={<ContactsOutlined />}>
              Thêm/Sửa lịch học
            </Menu.Item>
            <Menu.Item key="themBuoiHoc" icon={<DiffOutlined />}>
              Thêm/Sửa buổi học
            </Menu.Item>
            <Menu.Item key="themLichThi" icon={<SnippetsOutlined />}>
              Thêm/Sửa buổi thi
            </Menu.Item>
            {userInfo?.phanQuyen !== 2 && (
              <Menu.Item key="nhapDiem" icon={<FileAddOutlined />}>
                Nhập Điểm
              </Menu.Item>
            )}
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
              Xóa
            </Menu.Item>
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
      <h1 className="page-name">QUẢN LÝ LỚP HỌC</h1>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm Mã Lớp Học, Tên Lớp Học"
          onSearch={onSearch}
          enterButton
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="button-container">
          <Button className="custom-button" onClick={() => setIsAddModalVisible(true)}>
            Thêm Lớp Học
          </Button>
          <Button className="custom-button" onClick={exportLopHocToExcel}>
            Xuất Excel
          </Button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="maLopHoc"
        loading={loading}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />

      <SuaLopHocModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={onEditSubmit}
        initialValues={selectedRecord}
      />

      <AddLopHoc
        visible={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          fetchLopHocData();
        }}
      />

      <Modal
        open={isThemLichHocVisible}
        onCancel={() => setIsThemLichHocVisible(false)}
        onOk={handleEditCancel}
        width={1000}
      >
        <ThemLichHoc maLopHoc={selectedRecord?.maLopHoc || ''} />
      </Modal>

      <ThemBuoiHocModal
        maLopHoc={selectedRecord?.maLopHoc || ''}
        visible={isThemBuoiHocVisible}
        onCancel={() => setIsThemBuoiHocVisible(false)}
      />

      <ThemLichThiModal
        maLopHoc={selectedRecord?.maLopHoc || ''}
        visible={isThemLichThiVisible}
        onCancel={() => setIsThemLichThiVisible(false)}
      />
    </Layout>
  );
};

export default LopHoc;
