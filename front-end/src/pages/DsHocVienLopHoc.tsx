import React, { useEffect, useState } from 'react';
import { Table, Layout, Tag, message, Button, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HocVienType } from '../types/HocVienType';
import { DsLopHocType } from '../types/DsHocVienLopHocType';
import { DeleteOutlined, LeftCircleOutlined } from '@ant-design/icons';
import '../styles/TableCustom.css';
import * as XLSX from 'xlsx';

const { Search } = Input;

const DsHocVienLopHoc: React.FC = () => {
  const { maLopHoc } = useParams<{ maLopHoc: string }>();
  const navigate = useNavigate();
  const [hocVienList, setHocVienList] = useState<DsLopHocType[]>([]);
  const [tenLopHoc, setTenLopHoc] = useState<string>('');
  const [hocVienData, setHocVienData] = useState<HocVienType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

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

  const filteredHocVienList = hocVienList
    .filter(hocVien => hocVien.maLopHoc === maLopHoc)
    .filter(hocVien => {
      const hocVienInfo = getHocVienInfo(hocVien.maHocVien);
      return (
        hocVien.maHocVien.toLowerCase().includes(searchText.toLowerCase()) ||
        hocVienInfo.tenHocVien.toLowerCase().includes(searchText.toLowerCase())
      );
    });

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const exportDsLopHocToExcel = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/lophoc/xuat-ds-lophoc/${maLopHoc}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'arraybuffer',
      });

      const workbook = XLSX.read(response.data, { type: 'array' });
      XLSX.writeFile(workbook, `DanhSachHocVienLop_${maLopHoc}.xlsx`);
      message.success(`Xuất danh sách học viên cho lớp ${maLopHoc} thành công!`);
    } catch (error) {
      console.error('Lỗi khi xuất danh sách học viên:', error);
      message.error('Xuất danh sách học viên không thành công');
    }
  };

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
      <div className="button-container1" >
        <Button icon={<LeftCircleOutlined />} onClick={() => navigate(-1)} className='custom-button' style={{ marginBottom: '10px' }}>
          Quay lại
        </Button>
      </div>
      <h1 className="page-name1" >DANH SÁCH HỌC VIÊN CỦA LỚP: {tenLopHoc} ({maLopHoc})</h1>
      <div className='ds-layout'>
        <div className="button-container">
          <Search
            className="custom-search"
            placeholder="Tìm kiếm Mã Lớp Học, Tên Lớp Học"
            onSearch={handleSearch}
            enterButton
          />
          <div className="button-container">
            <Button className='custom-button' onClick={exportDsLopHocToExcel}>
              Xuất Excel
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredHocVienList}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowKey="maHocVien"
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
    </Layout>
  );
};

export default DsHocVienLopHoc;
