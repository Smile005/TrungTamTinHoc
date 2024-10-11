import React, { useState, useEffect } from 'react';
import { Tabs, Table, Input, message } from 'antd';
import axios from 'axios';
import { CaHocType } from '../types/CaHocType';
import { NhanVienType } from '../types/NhanVienType';
import { PhongHocType } from '../types/PhongHocType';
import { LopHocType } from '../types/LopHocType';
import { HocVienType } from '../types/HocVienType';
import { MonHocType } from '../types/MonHocType';
import { TaiKhoanType } from '../types/TaiKhoanType';
import '../styles/TableCustom.css';

const caHocColumns = [
  { title: 'Mã Ca', dataIndex: 'maCa', key: 'maCa' },
  { title: 'Bắt Đầu', dataIndex: 'batDau', key: 'batDau' },
  { title: 'Kết Thúc', dataIndex: 'ketThuc', key: 'ketThuc' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const hocVienColumns = [
  { title: 'Mã Học Viên', dataIndex: 'maHocVien', key: 'maHocVien' },
  { title: 'Tên Học Viên', dataIndex: 'tenHocVien', key: 'tenHocVien' },
  { title: 'Giới Tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
  { title: 'Ngày Vào Học', dataIndex: 'ngayVaoHoc', key: 'ngayVaoHoc' },
  { title: 'Số Điện Thoại', dataIndex: 'sdt', key: 'sdt' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Tình Trạng', dataIndex: 'tinhTrang', key: 'tinhTrang' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const lopHocColumns = [
  { title: 'Mã Lớp Học', dataIndex: 'maLopHoc', key: 'maLopHoc' },
  { title: 'Tên Lớp Học', dataIndex: 'tenLopHoc', key: 'tenLopHoc' },
  { title: 'Mã Môn Học', dataIndex: 'maMonHoc', key: 'maMonHoc' },
  { title: 'Mã Nhân Viên', dataIndex: 'maNhanVien', key: 'maNhanVien' },
  { title: 'Ngày Bắt Đầu', dataIndex: 'ngayBatDau', key: 'ngayBatDau' },
  { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const monHocColumns = [
  { title: 'Mã Môn Học', dataIndex: 'maMonHoc', key: 'maMonHoc' },
  { title: 'Tên Môn Học', dataIndex: 'tenMonHoc', key: 'tenMonHoc' },
  { title: 'Số Buổi Học', dataIndex: 'soBuoiHoc', key: 'soBuoiHoc' },
  { title: 'Học Phí', dataIndex: 'hocPhi', key: 'hocPhi' },
  { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const nhanVienColumns = [
  { title: 'Mã Nhân Viên', dataIndex: 'maNhanVien', key: 'maNhanVien' },
  { title: 'Tên Nhân Viên', dataIndex: 'tenNhanVien', key: 'tenNhanVien' },
  { title: 'Chức Vụ', dataIndex: 'chucVu', key: 'chucVu' },
  { title: 'Giới Tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
  { title: 'Ngày Vào Làm', dataIndex: 'ngayVaoLam', key: 'ngayVaoLam' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const phongHocColumns = [
  { title: 'Mã Phòng', dataIndex: 'maPhong', key: 'maPhong' },
  { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
];

const taiKhoanColumns = [
  { title: 'Mã Nhân Viên', dataIndex: 'maNhanVien', key: 'maNhanVien' },
  { title: 'Phân Quyền', dataIndex: 'phanQuyen', key: 'phanQuyen' },
  { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
];

const TimKiem: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // Lưu trạng thái tìm kiếm
  const [caHocData, setCaHocData] = useState<CaHocType[]>([]);
  const [hocVienData, setHocVienData] = useState<HocVienType[]>([]);
  const [lopHocData, setLopHocData] = useState<LopHocType[]>([]);
  const [monHocData, setMonHocData] = useState<MonHocType[]>([]);
  const [nhanVienData, setNhanVienData] = useState<NhanVienType[]>([]);
  const [phongHocData, setPhongHocData] = useState<PhongHocType[]>([]);
  const [taiKhoanData, setTaiKhoanData] = useState<TaiKhoanType[]>([]);

  const [filteredCaHoc, setFilteredCaHoc] = useState<CaHocType[]>([]);
  const [filteredHocVien, setFilteredHocVien] = useState<HocVienType[]>([]);
  const [filteredLopHoc, setFilteredLopHoc] = useState<LopHocType[]>([]);
  const [filteredMonHoc, setFilteredMonHoc] = useState<MonHocType[]>([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState<NhanVienType[]>([]);
  const [filteredPhongHoc, setFilteredPhongHoc] = useState<PhongHocType[]>([]);
  const [filteredTaiKhoan, setFilteredTaiKhoan] = useState<TaiKhoanType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cahocResponse = await axios.get('http://localhost:8081/api/cahoc', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hocvienResponse = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lophocResponse = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monhocResponse = await axios.get('http://localhost:8081/api/monhoc/ds-monhoc', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nhanvienResponse = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const phonghocResponse = await axios.get('http://localhost:8081/api/phonghoc/ds-phong', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taikhoanResponse = await axios.get('http://localhost:8081/api/auth/ds-taikhoan', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCaHocData(cahocResponse.data);
        setHocVienData(hocvienResponse.data);
        setLopHocData(lophocResponse.data);
        setMonHocData(monhocResponse.data);
        setNhanVienData(nhanvienResponse.data);
        setPhongHocData(phonghocResponse.data);
        setTaiKhoanData(taikhoanResponse.data);

        // Khởi tạo dữ liệu ban đầu cho các bảng lọc
        setFilteredCaHoc(cahocResponse.data);
        setFilteredHocVien(hocvienResponse.data);
        setFilteredLopHoc(lophocResponse.data);
        setFilteredMonHoc(monhocResponse.data);
        setFilteredNhanVien(nhanvienResponse.data);
        setFilteredPhongHoc(phonghocResponse.data);
        setFilteredTaiKhoan(taikhoanResponse.data);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Khi searchText thay đổi, cập nhật lại danh sách lọc
    const lowerValue = searchText.toLowerCase();

    setFilteredCaHoc(
      caHocData.filter(
        (item) =>
          item.maCa.toLowerCase().includes(lowerValue) ||
          item.trangThai?.toLowerCase().includes(lowerValue) ||
          item.ghiChu?.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredHocVien(
      hocVienData.filter(
        (item) =>
          item.maHocVien.toLowerCase().includes(lowerValue) ||
          item.tenHocVien.toLowerCase().includes(lowerValue) ||
          item.email?.toLowerCase().includes(lowerValue) ||
          item.sdt?.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredLopHoc(
      lopHocData.filter(
        (item) =>
          item.maLopHoc.toLowerCase().includes(lowerValue) ||
          item.tenLopHoc.toLowerCase().includes(lowerValue) ||
          item.trangThai.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredMonHoc(
      monHocData.filter(
        (item) =>
          item.maMonHoc.toLowerCase().includes(lowerValue) ||
          item.tenMonHoc.toLowerCase().includes(lowerValue) ||
          item.trangThai?.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredNhanVien(
      nhanVienData.filter(
        (item) =>
          item.maNhanVien.toLowerCase().includes(lowerValue) ||
          item.tenNhanVien.toLowerCase().includes(lowerValue) ||
          item.chucVu?.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredPhongHoc(
      phongHocData.filter(
        (item) =>
          item.maPhong.toLowerCase().includes(lowerValue) ||
          item.trangThai?.toLowerCase().includes(lowerValue)
      )
    );

    setFilteredTaiKhoan(
      taiKhoanData.filter(
        (item) =>
          item.maNhanVien.toLowerCase().includes(lowerValue) ||
          item.trangThai.toLowerCase().includes(lowerValue)
      )
    );
  }, [searchText, caHocData, hocVienData, lopHocData, monHocData, nhanVienData, phongHocData, taiKhoanData]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <div>
      <h1 className="page-name">Tìm Kiếm Dữ Liệu</h1>
      <Input.Search
        placeholder="Nhập từ khóa tìm kiếm"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20 }}
      />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Ca Học" key="1">
          <Table columns={caHocColumns} dataSource={filteredCaHoc} rowKey="maCa" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Học Viên" key="2">
          <Table columns={hocVienColumns} dataSource={filteredHocVien} rowKey="maHocVien" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lớp Học" key="3">
          <Table columns={lopHocColumns} dataSource={filteredLopHoc} rowKey="maLopHoc" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Môn Học" key="4">
          <Table columns={monHocColumns} dataSource={filteredMonHoc} rowKey="maMonHoc" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Nhân Viên" key="5">
          <Table columns={nhanVienColumns} dataSource={filteredNhanVien} rowKey="maNhanVien" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Phòng Học" key="6">
          <Table columns={phongHocColumns} dataSource={filteredPhongHoc} rowKey="maPhong" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tài Khoản" key="7">
          <Table columns={taiKhoanColumns} dataSource={filteredTaiKhoan} rowKey="maNhanVien" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TimKiem;
