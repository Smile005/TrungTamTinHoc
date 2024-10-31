import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LopHocType } from '../types/LopHocType';
import '../styles/TableCustom.css';

interface LopHocTypeWithMax extends LopHocType {
  soLuongToiDa: number;
}

const { Search } = Input;

const DsLop: React.FC = () => {
  const [data, setData] = useState<LopHocTypeWithMax[]>([]);
  const [filteredData, setFilteredData] = useState<LopHocTypeWithMax[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLopHocData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const lopHocData = response.data;

        const lopHocWithSoLuong = await Promise.all(
          lopHocData.map(async (lopHoc: LopHocTypeWithMax) => {
            try {
              const hocVienResponse = await axios.get(
                `http://localhost:8081/api/lophoc/ds-hocvien?maLopHoc=${lopHoc.maLopHoc}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );

              const soLuongHienTai = hocVienResponse.data.filter((hocVien: any) => hocVien.maLopHoc === lopHoc.maLopHoc).length;

              return { ...lopHoc, soLuongToiDa: lopHoc.soLuongMax, soLuong: soLuongHienTai };
            } catch (error) {
              message.error(`Lỗi khi lấy dữ liệu học viên của lớp ${lopHoc.maLopHoc}`);
              return { ...lopHoc, soLuongToiDa: lopHoc.soLuongMax, soLuong: 0 };
            }
          })
        );

        setData(lopHocWithSoLuong);
        setFilteredData(lopHocWithSoLuong); 
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocData();
  }, []);

  const onSearch = (value: string) => {
    const filtered = data.filter((item) =>
      item.maLopHoc.toLowerCase().includes(value.toLowerCase()) ||
      item.tenLopHoc.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); 
  };

  const columns = [
    {
      title: 'Mã Lớp Học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
    },
    {
      title: 'Tên Lớp Học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
    },
    {
      title: 'Số Lượng Học Viên',
      dataIndex: 'soLuong',
      key: 'soLuong',
      render: (soLuong: number, record: LopHocTypeWithMax) => (
        `${soLuong}/${record.soLuongToiDa}`
      ),
    },
    {
      title: 'Chi Tiết Lớp Học',
      key: 'action',
      render: (text: any, record: LopHocTypeWithMax) => (
        <Link to={`/ds-hoc-vien-lop/${record.maLopHoc}`}>Xem chi tiết</Link>
      ),
    },
  ];

  return (
    <div>
      <div className="search-header">
        <h1 className="page-name">DANH SÁCH LỚP</h1>
      </div>
      <div className="button-container">
        <Search
          className="custom-search"
          placeholder="Tìm kiếm"
          onSearch={onSearch}
          enterButton
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="maLopHoc"
        pagination={{ pageSize: 5 }}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
        components={{
          header: {
            cell: (props: any) => (
              <th {...props} style={{ backgroundColor: '#f0f0f0' }} />
            ),
          },
        }}
      />
    </div>
  );
};

export default DsLop;
