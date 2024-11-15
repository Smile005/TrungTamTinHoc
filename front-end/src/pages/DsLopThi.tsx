import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LopHocType } from '../types/LopHocType';
import '../styles/TableCustom.css';

interface LopHocTypeWithThi extends LopHocType {
  soLuongThi: number;
}

const { Search } = Input;

const DsLopThi: React.FC = () => {
  const [data, setData] = useState<LopHocTypeWithThi[]>([]);
  const [filteredData, setFilteredData] = useState<LopHocTypeWithThi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLopHocThiData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const lopHocData = response.data;

        const lopHocWithThi = await Promise.all(
          lopHocData.map(async (lopHoc: LopHocType) => {
            try {
              const hocVienThiResponse = await axios.get(
                `http://localhost:8081/api/lophoc/xet-thi-cuoi-ky/${lopHoc.maLopHoc}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );

              const soLuongThi = hocVienThiResponse.data.danhSachThi.length;

              // Chỉ trả về lớp có số lượng thi > 0
              if (soLuongThi > 0) {
                return { ...lopHoc, soLuongThi };
              }
              return null; // Lớp không đáp ứng điều kiện
            } catch {
              return null; // Bỏ qua lớp nếu gặp lỗi
            }
          })
        );

        // Loại bỏ các giá trị null khỏi danh sách
        const validLopHocWithThi = lopHocWithThi.filter((lopHoc) => lopHoc !== null) as LopHocTypeWithThi[];

        setData(validLopHocWithThi);
        setFilteredData(validLopHocWithThi);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocThiData();
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
      title: 'Số Lượng Học Viên Thi Cuối Kỳ',
      dataIndex: 'soLuongThi',
      key: 'soLuongThi',
    },
    {
      title: 'Chi Tiết Lớp Thi',
      key: 'action',
      render: (text: any, record: LopHocTypeWithThi) => (
        <Link to={`/ds_thi/${record.maLopHoc}`}>Xem chi tiết</Link>
      ),
    },
  ];

  return (
    <div>
      <div className="search-header">
        <h1 className="page-name">DANH SÁCH LỚP THI</h1>
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

export default DsLopThi;
