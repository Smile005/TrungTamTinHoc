import React, { useEffect, useState } from 'react';
import { Table, Layout, Tag, message, Button, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HocVienType } from '../types/HocVienType';
import { DsLopHocType } from '../types/DsHocVienLopHocType';
import { DeleteOutlined, LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import '../styles/TableCustom.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import * as XLSX from 'xlsx';

const { Search } = Input;

const DsHocVienLopHoc: React.FC = () => {
  const navigate = useNavigate();
  const phanQuyen = useSelector((state: RootState) => state.auth.userInfo?.phanQuyen);
  const { maLopHoc } = useParams<{ maLopHoc: string }>();
  const [hocVienList, setHocVienList] = useState<DsLopHocType[]>([]);
  const [tenLopHoc, setTenLopHoc] = useState<string>('');
  const [hocVienData, setHocVienData] = useState<HocVienType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

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

  const onDelete = async (maHocVien: string) => {
    try {
      await axios.delete(`http://localhost:8081/api/lophoc/xoaXepLop`, {
        data: { maLopHoc, maHocVien },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setHocVienList(prevList => prevList.filter(hocVien => hocVien.maHocVien !== maHocVien));
      message.success('Xóa học viên khỏi lớp học thành công!');
    } catch (error) {
      message.error('Xóa học viên không thành công');
    }
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
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string) => (
        <span style={{ color: trangThai === 'Đã Đóng Học Phí' ? 'green' : 'red' }}>
          {trangThai}
        </span>
      ),
    },
    {
      title: 'Quản lý',
      key: 'action',
      render: (_: any, record: DsLopHocType) => (
        <span>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.maHocVien)}
          />
        </span>
      ),
    },
  ];

  const hasPermission = phanQuyen === 0 || phanQuyen === 1 || phanQuyen === 2;
    if (!hasPermission) {
      return <div>Bạn không có quyền truy cập trang này.</div>;
    }

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
            <Tooltip title="Lớp phải có lịch học thì mới có danh sách thi" className='top-tip'>
              <ExclamationCircleOutlined />
            </Tooltip>
            {userInfo?.phanQuyen !== 2 && (
              <>
                <Button className='custom-button' onClick={() => navigate(`/nhapdiem/${maLopHoc}`)}>
                  Nhập Điểm
                </Button>
                <Button
                  className='custom-button'
                  onClick={() => navigate(`/ds_thi/${maLopHoc}`)}
                >
                  Danh Sách Thi
                </Button>
              </>
            )}
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
