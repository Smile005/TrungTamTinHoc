import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, message, Layout, Tag, Button, Menu, Dropdown } from 'antd'; // Bổ sung các thành phần từ Ant Design
import { EditOutlined, DeleteOutlined, OrderedListOutlined, MoreOutlined } from '@ant-design/icons'; // Bổ sung icon từ Ant Design
import { LopHocType } from '../types/LopHocType'; // Import LopHocType
import moment from 'moment'; // Import moment.js để định dạng ngày tháng
import '../styles/TableCustom.css';

const Testing: React.FC = () => {
  const [lopHocData, setLopHocData] = useState<LopHocType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLopHocData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
          },
        });
        setLopHocData(response.data); // Lưu dữ liệu lớp học vào state
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        message.error('Lỗi khi lấy dữ liệu lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocData(); // Gọi API khi component được render lần đầu
  }, []);

  const handleMenuClick = (e: any, record: LopHocType) => {
    if (e.key === 'edit') {
      // Xử lý logic khi người dùng nhấn vào "Xem và sửa thông tin"
      message.info(`Sửa lớp học: ${record.tenLopHoc}`);
    } else if (e.key === 'danhSachLop') {
      // Xử lý logic khi người dùng nhấn vào "Danh sách lớp"
      message.info(`Xem danh sách lớp của: ${record.tenLopHoc}`);
    } else if (e.key === 'delete') {
      // Xử lý logic khi người dùng nhấn vào "Xóa"
      message.info(`Xóa lớp học: ${record.tenLopHoc}`);
    }
  };

  // Cấu hình các cột cho bảng
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
      dataIndex: 'maMonHoc',
      key: 'maMonHoc',
      width: '12%',
    },
    {
      title: 'Giảng Viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
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
      dataIndex: 'soLuong',
      key: 'soLuong',
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
      <h1 className="page-name">Danh Sách Lớp Học - Testing</h1>
      <Table
        columns={columns}
        dataSource={lopHocData}
        rowKey="maLopHoc"
        loading={loading}
        pagination={{ pageSize: 5 }}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />
    </Layout>
  );
};

export default Testing;
