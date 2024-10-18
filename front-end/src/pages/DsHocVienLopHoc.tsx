import React, { useEffect, useState } from 'react';
import { Table, Layout, Tag, message, Button,  } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HocVienType } from '../types/HocVienType';
import { DsLopHocType } from '../types/DsHocVienLopHocType';
import { DeleteOutlined  } from '@ant-design/icons';
import '../styles/TableCustom.css';

const DsHocVienLopHoc: React.FC = () => {
  const { maLopHoc } = useParams<{ maLopHoc: string }>();
  const [hocVienList, setHocVienList] = useState<DsLopHocType[]>([]);
  const [tenLopHoc, setTenLopHoc] = useState<string>('');
  const [hocVienData, setHocVienData] = useState<HocVienType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lopHocResponse = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const lopHocData = lopHocResponse.data.find((lopHoc: any) => lopHoc.maLopHoc === maLopHoc);
        setTenLopHoc(lopHocData?.tenLopHoc || 'Không tìm thấy lớp học');

        if (lopHocData) {
          const dsHocVienResponse = await axios.get('http://localhost:8081/api/lophoc/ds-hocvien', {
            params: { maLopHoc: lopHocData.maLopHoc },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setHocVienList(dsHocVienResponse.data);
        }

        const hocVienResponse = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHocVienData(hocVienResponse.data);
      } catch (error) {
        message.error('Lỗi khi lấy thông tin lớp học hoặc danh sách học viên');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maLopHoc]);

  const getHocVienInfo = (maHocVien: string) => {
    const hocVien = hocVienData.find(hv => hv.maHocVien === maHocVien);
    return hocVien
      ? {
        tenHocVien: hocVien.tenHocVien,
        sdt: hocVien.sdt,
        gioiTinh: hocVien.gioiTinh,
      }
      : {
        tenHocVien: 'Không xác định',
        sdt: 'Không xác định',
        gioiTinh: 'Không xác định',
      };
  };

  const filteredHocVienList = hocVienList.filter(hocVien => hocVien.maLopHoc === maLopHoc);

  const columns = [
    {
      title: 'Mã Học Viên',
      dataIndex: 'maHocVien',
      key: 'maHocVien',
    },
    {
      title: 'Tên Học Viên',
      key: 'tenHocVien',
      render: (_: any, record: DsLopHocType) => getHocVienInfo(record.maHocVien).tenHocVien,
    },
    {
      title: 'Giới Tính',
      key: 'gioiTinh',
      render: (_: any, record: DsLopHocType) => {
        const { gioiTinh } = getHocVienInfo(record.maHocVien);
        let color = gioiTinh === 'Nam' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{gioiTinh}</Tag>;
      },
    },
    {
      title: 'Số Điện Thoại',
      key: 'sdt',
      render: (_: any, record: DsLopHocType) => getHocVienInfo(record.maHocVien).sdt,
    },
    {
      title: 'Quản lý',
      key: 'action',
      render: (_: any, record: DsLopHocType) => (
        <span>
          <Button type="link" icon={<DeleteOutlined />} />
        </span>
      ),
    },

  ];

  return (
    <Layout>
      <h1 className="page-name">DANH SÁCH HỌC VIÊN CỦA LỚP: {tenLopHoc} ({maLopHoc})</h1>

      <Table
        columns={columns}
        dataSource={filteredHocVienList}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="maHocVien"
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
      />
    </Layout>
  );
};

export default DsHocVienLopHoc;
