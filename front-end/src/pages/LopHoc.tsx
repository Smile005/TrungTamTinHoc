import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Layout, Tag, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, OrderedListOutlined, FileAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import { LopHocType } from '../types/LopHocType';
import SuaLopHocModal from '../components/SuaLopHocModal';
import AddLopHoc from '../components/AddLopHoc';
import { useNavigate } from 'react-router-dom';
import '../styles/TableCustom.css';
import moment from 'moment';
import * as XLSX from 'xlsx';

const { Search } = Input;

const LopHoc: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<LopHocType[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LopHocType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [monHocMap, setMonHocMap] = useState<{ [key: string]: string }>({});
  const [nhanVienMap, setNhanVienMap] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLopHocData = async () => {
      setLoading(true);
      try {
        const [lopHocResponse, nhanVienResponse, monHocResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:8081/api/monhoc/ds-monhoc', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        const monHocMap = monHocResponse.data.reduce((acc: any, monHoc: any) => {
          acc[monHoc.maMonHoc] = monHoc.tenMonHoc;
          return acc;
        }, {});

        const nhanVienMap = nhanVienResponse.data.reduce((acc: any, nhanVien: any) => {
          acc[nhanVien.maNhanVien] = nhanVien.tenNhanVien;
          return acc;
        }, {});

        setMonHocMap(monHocMap);
        setNhanVienMap(nhanVienMap);

        const formattedLopHoc = lopHocResponse.data.map((lopHoc: LopHocType) => ({
          ...lopHoc,
          tenMonHoc: lopHoc.maMonHoc ? monHocMap[lopHoc.maMonHoc] : 'Không xác định',
          tenNhanVien: lopHoc.maNhanVien ? nhanVienMap[lopHoc.maNhanVien] : 'Không xác định',
        }));

        setFilteredData(formattedLopHoc);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        message.error('Lỗi khi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocData();
  }, []);

  const onSearch = (value: string) => {
    const filtered = filteredData.filter((item) =>
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
      // <Modal> <ThemLichHoc /> </Modal>
    } else if (e.key === 'nhapDiem') {
      navigate(`/nhapdiem/${record.maLopHoc}`);
    } else if (e.key === 'delete') {
      deleteLopHoc(record.maLopHoc);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (values: any) => {
    const updatedData = filteredData.map((item) =>
      item.maLopHoc === selectedRecord?.maLopHoc ? { ...selectedRecord, ...values } : item
    );
    setFilteredData(updatedData);
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
      setFilteredData(filteredData.filter(item => item.maLopHoc !== maLopHoc));
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
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'arraybuffer'
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
      render: (ngayBatDau: string) => moment(ngayBatDau).format("DD/MM/YYYY"),
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
            <Menu.Item key="edit" icon={<EditOutlined />}>Xem và sửa thông tin</Menu.Item>
            <Menu.Item key="danhSachLop" icon={<OrderedListOutlined />}>Danh sách lớp</Menu.Item>
            <Menu.Item key="themLichHoc" icon={<OrderedListOutlined />}>Thêm lịch học</Menu.Item>
            <Menu.Item key="nhapDiem" icon={<FileAddOutlined />}>Nhập Điểm</Menu.Item>
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
      <h1 className='page-name'>QUẢN LÝ LỚP HỌC</h1>
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
          <Button className='custom-button' onClick={() => setIsAddModalVisible(true)}>Thêm Lớp Học</Button>
          <Button className='custom-button' onClick={exportLopHocToExcel}>
            Xuất Excel
          </Button>
          <Button className='custom-button'>Nhập Excel</Button>
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
        onSubmit={handleEditSubmit}
        initialValues={selectedRecord}
      />

      <AddLopHoc
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
      />
    </Layout>
  );
};

export default LopHoc;
