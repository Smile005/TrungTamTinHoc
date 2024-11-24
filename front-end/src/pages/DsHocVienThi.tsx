import React, { useEffect, useState } from 'react';
import { Table, Layout, Tag, message, Button, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TableCustom.css';
import { LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';

const { Search } = Input;

const DsHocVienThi: React.FC = () => {
  const { maLopHoc } = useParams<{ maLopHoc: string }>();
  const navigate = useNavigate();
  const [hocVienThiList, setHocVienThiList] = useState<any[]>([]);
  const [tenLopHoc, setTenLopHoc] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseLopHoc = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const danhSachLopHoc = responseLopHoc.data;
        const lopHoc = danhSachLopHoc.find((lop: any) => lop.maLopHoc === maLopHoc);
        setTenLopHoc(lopHoc?.tenLopHoc || 'Không rõ');

        // Gọi API lấy danh sách đủ điều kiện thi
        const responseThi = await axios.get(
          `http://localhost:8081/api/lophoc/xet-thi-cuoi-ky/${maLopHoc}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const { danhSachThi } = responseThi.data;

        // Gọi API lấy danh sách học viên
        const responseHocVien = await axios.get(
          `http://localhost:8081/api/hocvien/ds-hocvien`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const danhSachHocVien = responseHocVien.data;

        // Gọi API lấy điểm thường kỳ và giữa kỳ
        const responseDiem = await axios.get(
          `http://localhost:8081/api/lophoc/ds-hocvien?maLopHoc=${maLopHoc}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const danhSachDiem = responseDiem.data;

        const hocVienThiDetails = danhSachThi.map((maHocVien: string) => {
          const hocVien = danhSachHocVien.find((hv: any) => hv.maHocVien === maHocVien);
          const diemHocVien = danhSachDiem.find(
            (diem: any) => diem.maHocVien === maHocVien && diem.maLopHoc === maLopHoc // Kiểm tra cả maHocVien và maLopHoc
          );
          return {
            maHocVien,
            tenHocVien: hocVien?.tenHocVien || 'Không rõ',
            gioiTinh: hocVien?.gioiTinh || 'Không rõ',
            ngaySinh: hocVien?.ngaySinh ? moment(hocVien.ngaySinh).format('DD/MM/YYYY') : 'Không rõ',
            sdt: hocVien?.sdt || 'Không rõ',
            diemThuongKy: diemHocVien?.diemThuongKy || 'Chưa có',
            diemGiuaKy: diemHocVien?.diemGiuaKy || 'Chưa có',
          };
        });

        setHocVienThiList(hocVienThiDetails);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maLopHoc]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const exportDsThiToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(hocVienThiList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachThi');
      XLSX.writeFile(workbook, `DanhSachThi_${maLopHoc}.xlsx`);
      message.success('Xuất danh sách thi thành công!');
    } catch (error) {
      message.error('Xuất danh sách thi không thành công!');
    }
  };

  const filteredHocVienThiList = hocVienThiList.filter(hocVien =>
    hocVien.maHocVien.toLowerCase().includes(searchText.toLowerCase()) ||
    hocVien.tenHocVien.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã Học Viên',
      dataIndex: 'maHocVien',
      key: 'maHocVien',
    },
    {
      title: 'Tên Học Viên',
      dataIndex: 'tenHocVien',
      key: 'tenHocVien',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      render: (gioiTinh: string) => {
        let color = gioiTinh === 'Nam' ? 'geekblue' : 'volcano';
        return <Tag color={color}>{gioiTinh}</Tag>;
      },
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Điểm Thường Kỳ',
      dataIndex: 'diemThuongKy',
      key: 'diemThuongKy',
    },
    {
      title: 'Điểm Giữa Kỳ',
      dataIndex: 'diemGiuaKy',
      key: 'diemGiuaKy',
    },
  ];

  return (
    <Layout>
      <div className="button-container1">
        <Button
          onClick={() => navigate(-1)}
          style={{ marginBottom: '10px' }}
          icon={<LeftCircleOutlined />}
          className='custom-button'
        >
          Quay lại
        </Button>
      </div>
      <h1 className="page-name1">
        DANH SÁCH HỌC VIÊN THI CUỐI KỲ LỚP: {tenLopHoc} ({maLopHoc})
      </h1>
      <div className='ds-layout'>
        <div className="button-container">
          <Search
            className="custom-search"
            placeholder="Tìm kiếm Mã Học Viên, Tên Học Viên"
            onSearch={handleSearch}
            enterButton
          />
          <div className="button-container">
            <Tooltip title="Phải sắp xếp lịch học trước thì mới được xét tư cách thi" className='top-tip'>
              <ExclamationCircleOutlined />
            </Tooltip>
            <Button className='custom-button' onClick={exportDsThiToExcel}>
              Xuất Excel
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredHocVienThiList}
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

export default DsHocVienThi;
