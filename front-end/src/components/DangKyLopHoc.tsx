import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Select, Steps, Table, message, theme } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';
import { HocVienType } from '../types/HocVienType';
import { ChiTietHDType } from '../types/HoaDonType';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ChiTietHoaDon from '../components/ChiTietHoaDon';
import "../styles/ButtonCustom.css"
import moment from 'moment';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DangKyLopHocProps {
  visible: boolean;
  onCancel: () => void;
  hocVien: HocVienType;
}

type LopHocType01 = {
  maLopHoc: string;
  tenLopHoc: string;
  maMonHoc: string;
  soLuongHV: number;
  soLuongMax: number;
  trangThai: string;
  ngayBatDau: string;
  soBuoiHoc: number;
  tenGiangVien: string;
  lichHoc: string;
};

const DangKyLopHoc: React.FC<DangKyLopHocProps> = ({ visible, onCancel, hocVien }) => {
  const { token } = theme.useToken();
  const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string, trangThai: string }[]>([]);
  const [lopHocList, setLopHocList] = useState<LopHocType01[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selectedMonHoc, setSelectedMonHoc] = useState<string | undefined>(undefined);
  const [selectedLopHoc, setSelectedLopHoc] = useState<string | undefined>(undefined);
  const [registeredClasses, setRegisteredClasses] = useState<{ maLopHoc: string; tenLopHoc: string; trangThai: string }[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<ChiTietHDType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [maHoaDon, setMaHoaDon] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tenNhanVien, setTenNhanVien] = useState<string>('');

  const steps = [
    {
      title: 'Bước 1: Đăng ký lớp học',
      content: (
        <LopHocForm
          hocVien={hocVien}
          monHocList={monHocList}
          lopHocList={lopHocList}
          selectedMonHoc={selectedMonHoc}
          selectedLopHoc={selectedLopHoc}
          setSelectedMonHoc={setSelectedMonHoc}
          setSelectedLopHoc={setSelectedLopHoc}
          registeredClasses={registeredClasses}
          setRegisteredClasses={setRegisteredClasses}
        />
      ),
    },
    {
      title: 'Bước 2: Tạo hóa đơn',
      content: (
        <HoaDonForm
          hocVien={hocVien}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setInvoiceDetails={setInvoiceDetails}
          setTotalAmount={setTotalAmount}
          setMaHoaDon={setMaHoaDon}
        />
      ),
    },
    {
      title: 'Bước 3: Thông tin hóa đơn',
      content: (
        <>
          <InvoiceSummary
            invoiceDetails={invoiceDetails}
            totalAmount={totalAmount}
            tenHocVien={hocVien.tenHocVien}
            maHoaDon={maHoaDon}
          />
          <Button type="link" onClick={() => setIsModalVisible(true)}>
            Xem chi tiết hóa đơn
          </Button>
          {isModalVisible && (
            <ChiTietHoaDon
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              maHoaDon={maHoaDon}
            />
          )}
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '10px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 5,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [monHocResponse, lopHocResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/monhoc/ds-monhocHD', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:8081/api/lophoc/ds-lophocHD', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const lopHocData = lopHocResponse.data;

        const monHocWithClasses = monHocResponse.data.filter((monHoc: any) =>
          lopHocData.some((lopHoc: any) => lopHoc.maMonHoc === monHoc.maMonHoc)
        );

        setMonHocList(monHocWithClasses);
        setLopHocList(lopHocData);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu: ');
      }
    };

    fetchData();
  }, []);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleCancel = () => {
    setCurrent(0);
    setSelectedMonHoc(undefined);
    setSelectedLopHoc(undefined);
    setRegisteredClasses([]);
    onCancel();
  };

  return (
    <Modal title="Đăng ký lớp học" open={visible} onCancel={handleCancel} footer={null} width={1000}>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
        {current > 0 && <Button style={{ margin: '0 8px' }} onClick={prev}>Previous</Button>}
        {current < steps.length - 1 && <Button type="primary" onClick={next}>Next</Button>}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              message.success('Processing complete!');
              setCurrent(0);
              onCancel();
            }}
          >
            Done
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default DangKyLopHoc;

const LopHocForm: React.FC<{
  hocVien: HocVienType;
  monHocList: { maMonHoc: string; tenMonHoc: string; trangThai: string }[];
  lopHocList: LopHocType01[];
  selectedMonHoc: string | undefined;
  selectedLopHoc: string | undefined;
  setSelectedMonHoc: (value: string | undefined) => void;
  setSelectedLopHoc: (value: string | undefined) => void;
  registeredClasses: { maLopHoc: string; tenLopHoc: string; trangThai: string }[];
  setRegisteredClasses: (value: { maLopHoc: string; tenLopHoc: string; trangThai: string }[]) => void;
}> = ({
  hocVien,
  monHocList,
  lopHocList,
  selectedMonHoc,
  selectedLopHoc,
  setSelectedMonHoc,
  setSelectedLopHoc,
  registeredClasses,
  setRegisteredClasses,
}) => {
    const filteredLopHocList = lopHocList.filter((lopHoc) => lopHoc.maMonHoc === selectedMonHoc);
    const selectedLopHocObj = lopHocList.find((lopHoc) => lopHoc.maLopHoc === selectedLopHoc);
    const lopHocDaDangKy = registeredClasses;

    const columns = [
      { title: 'Mã lớp học', dataIndex: 'maLopHoc', key: 'maLopHoc' },
      { title: 'Tên lớp học', dataIndex: 'tenLopHoc', key: 'tenLopHoc' },
      { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
      {
        title: 'Thao tác',
        key: 'action',
        render: (text: string, record: { maLopHoc: string }) => (
          <Button type="link" onClick={() => handleDeleteLopHoc(record.maLopHoc)}>Xóa</Button>
        ),
      },
    ];

    const dangKy = async () => {
      if (!selectedLopHoc || !hocVien.maHocVien) {
        message.error('Vui lòng chọn lớp học và học viên.');
        return;
      }

      if (selectedLopHocObj && selectedLopHocObj.soLuongHV >= selectedLopHocObj.soLuongMax) {
        message.warning('Lớp học đã full. Vui lòng chọn lớp khác.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log(selectedLopHoc)
        console.log(hocVien.maHocVien)
        await axios.post(
          'http://localhost:8081/api/lophoc/xepLop',
          { maLopHoc: selectedLopHoc, maHocVien: hocVien.maHocVien },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        message.success('Đăng ký lớp học thành công!');

        setRegisteredClasses([
          ...lopHocDaDangKy,
          { maLopHoc: selectedLopHocObj?.maLopHoc || '', tenLopHoc: selectedLopHocObj?.tenLopHoc || '', trangThai: 'Chưa đóng học phí' },
        ]);
        setSelectedMonHoc(undefined);
        setSelectedLopHoc(undefined);
      } catch (error) {
        message.error('Đăng ký lớp học thất bại');
        console.log(error)
      }
    };

    const handleDeleteLopHoc = async (maLopHoc: string) => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:8081/api/lophoc/xoaXepLop', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          data: { maLopHoc, maHocVien: hocVien.maHocVien },
        });
        message.success('Xóa lớp học thành công!');
        setRegisteredClasses(registeredClasses.filter((lopHoc) => lopHoc.maLopHoc !== maLopHoc));
      } catch (error) {
        message.error('Xóa lớp học thất bại!');
      }
    };

    return (
      <>
        <h1>Thông tin học viên</h1>
        <div className="custom-info">
          {/* Dòng 1 */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span><b>Mã học viên:</b> {hocVien.maHocVien}</span>
            </Col>
            <Col span={8}>
              <span><b>Tên học viên:</b> {hocVien.tenHocVien}</span>
            </Col>
            <Col span={8}>
              <span><b>Giới tính:</b> {hocVien.gioiTinh}</span>
            </Col>
          </Row>

          {/* Dòng 2 */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span><b>Ngày sinh:</b> {moment(hocVien.ngaySinh).format("DD/MM/YYYY")}</span>
            </Col>
            <Col span={8}>
              <span><b>Email:</b> {hocVien.email}</span>
            </Col>
            <Col span={8}>
              <span><b>SDT:</b> {hocVien.sdt}</span>
            </Col>
          </Row>

          {/* Dòng 3 */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span><b>Địa chỉ:</b> {hocVien.diaChi}</span>
            </Col>
            <Col span={8}>
              <span><b>Ngày vào học:</b> {moment(hocVien.ngayVaoHoc).format("DD/MM/YYYY")}</span>
            </Col>
            <Col span={8}>
              <span><b>Tình trạng:</b> {hocVien.tinhTrang}</span>
            </Col>
          </Row>
        </div>

        <h1>Đăng ký lớp học</h1>
        <div className='custom-info' >
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <Select
                placeholder="Chọn môn học"
                style={{ width: '100%' }}
                value={selectedMonHoc}
                onChange={(value) => {
                  setSelectedMonHoc(value);
                  setSelectedLopHoc(undefined);
                }}
              >
                {monHocList.map((monHoc) => (
                  <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                    {monHoc.maMonHoc} - {monHoc.tenMonHoc}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={10}>
              <Select
                placeholder="Chọn lớp học"
                style={{ width: '100%' }}
                value={selectedLopHoc}
                onChange={setSelectedLopHoc}
                disabled={!selectedMonHoc}
              >
                {filteredLopHocList.map((lopHoc) => (
                  <Select.Option key={lopHoc.maLopHoc} value={lopHoc.maLopHoc}>
                    {lopHoc.maLopHoc} - {lopHoc.tenLopHoc}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span><b>Tên giảng viên:</b> {selectedLopHocObj ? selectedLopHocObj.tenGiangVien : ''}</span>
            </Col>
            <Col span={8}>
              <span>
                <b>Ngày bắt đầu: </b>
                {selectedLopHocObj?.ngayBatDau
                  ? moment(selectedLopHocObj.ngayBatDau).format("DD/MM/YYYY")
                  : ""}
              </span>
            </Col>
            <Col span={8}>
              <span><b>Số buổi học:</b> {selectedLopHocObj ? selectedLopHocObj.soBuoiHoc : ''}</span>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span><b>Lịch học:</b> {selectedLopHocObj ? selectedLopHocObj.lichHoc : ''}</span>
            </Col>
            <Col span={8}>
              <span><b>Số lượng học viên:</b> {selectedLopHocObj ? `${selectedLopHocObj.soLuongHV} / ${selectedLopHocObj.soLuongMax}` : ''}</span>
            </Col>
            <Col span={8}>
              <span><b>Trạng thái:</b> {selectedLopHocObj ? selectedLopHocObj.trangThai : ''}</span>
            </Col>
          </Row>
          <Row className='dk-row'>
            <Button type="primary" onClick={dangKy} className='dk-class'>
              Đăng ký
            </Button>
          </Row>
        </div>

        <h1>Lớp học đã đăng ký</h1>
        <Table columns={columns} dataSource={lopHocDaDangKy} pagination={false} />
      </>
    );
  };

const HoaDonForm: React.FC<{
  hocVien: { maHocVien: string; tenHocVien: string };
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
  setInvoiceDetails: (details: ChiTietHDType[]) => void;
  setTotalAmount: (amount: number) => void;
  setMaHoaDon: (maHoaDon: string) => void;
}> = ({ hocVien, selectedRowKeys, setSelectedRowKeys, setInvoiceDetails, setTotalAmount, setMaHoaDon }) => {
  const [dataSource, setDataSource] = useState<ChiTietHDType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tenNhanVien, setTenNhanVien] = useState<string>(''); // Thêm state để lưu tên nhân viên
  const maNhanVien = useSelector((state: RootState) => state.auth.userInfo?.maNhanVien) || '';
  const ngayTaoHoaDon = new Date().toISOString();
  const [totalAmount, internalSetTotalAmount] = useState<number>(0);

  const columns = [
    { title: 'Mã lớp học', dataIndex: 'maLopHoc' },
    { title: 'Tên lớp học', dataIndex: 'tenLopHoc' },
    { title: 'Học phí', dataIndex: 'hocPhi', render: (hocPhi: number) => hocPhi.toLocaleString() },
    { title: 'Trạng thái', dataIndex: 'trangThai' },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedRows = dataSource.filter((item) => newSelectedRowKeys.includes(item.maLopHoc));
    const total = selectedRows.reduce((sum, row) => sum + row.hocPhi, 0);
    internalSetTotalAmount(total);
    setTotalAmount(total);
  };

  const rowSelection: TableRowSelection<ChiTietHDType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCreateInvoice = async () => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một lớp học để tạo hóa đơn.');
      return;
    }

    try {
      const chiTietHD = selectedRowKeys.map((maLopHoc) => ({ maLopHoc: maLopHoc as string }));
      const payload = { maNhanVien, maHocVien: hocVien.maHocVien, chiTietHD };
      const response = await axios.post('http://localhost:8081/api/hoadon/them-hoadon', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('Tạo hóa đơn thành công!');
      const invoiceDetailsResponse = await axios.get(`http://localhost:8081/api/hoadon/ds-hoadon?maHocVien=${hocVien.maHocVien}&maHoaDon=${response.data.maHoaDon}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setInvoiceDetails(invoiceDetailsResponse.data);
      setMaHoaDon(response.data.maHoaDon);
    } catch (error) {
      console.error('Error details:', error);
      message.error('Lỗi khi tạo hóa đơn');
    }
  };

  // Thêm API call để lấy danh sách nhân viên
  useEffect(() => {
    const fetchDanhSachNhanVien = async () => {
      if (!maNhanVien) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Tìm tên nhân viên theo mã nhân viên
        const nhanVien = response.data.find((nv: { maNhanVien: string }) => nv.maNhanVien === maNhanVien);
        setTenNhanVien(nhanVien ? nhanVien.tenNhanVien : 'Không xác định');
      } catch (error) {
        message.error('Không thể lấy danh sách nhân viên');
      }
    };

    fetchDanhSachNhanVien();
  }, [maNhanVien]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8081/api/lophoc/ds-theo-maHV/${hocVien.maHocVien}`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        const dataWithKeys = response.data.map((item: any) => ({ ...item, key: item.maLopHoc }));
        setDataSource(dataWithKeys);
        setLoading(false);
      } catch (error) {
        message.error('Không thể lấy danh sách lớp học');
      } finally {
        setLoading(false);
      }
    };

    if (hocVien.maHocVien) {
      fetchData();
    }
  }, [hocVien.maHocVien]);

  return (
    <>
      <h1>Thông tin hóa đơn</h1>
      <div className="custom-info">
        {/* Dòng 1 */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <span><b>Mã nhân viên:</b> {maNhanVien}</span>
          </Col>
          <Col span={12}>
            <span><b>Tên nhân viên:</b> {tenNhanVien}</span>
          </Col>
        </Row>
        {/* Dòng 2 */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <span><b>Mã học viên:</b> {hocVien.maHocVien}</span>
          </Col>
          <Col span={12}>
            <span><b>Tên học viên:</b> {hocVien.tenHocVien}</span>
          </Col>
        </Row>
        {/* Dòng 3 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <span><b>Ngày tạo hóa đơn:</b> {moment(ngayTaoHoaDon).format("DD/MM/YYYY")}</span>
          </Col>
        </Row>
      </div>

      <h1>Chi tiết hóa đơn</h1>
      <Table<ChiTietHDType> rowSelection={rowSelection} columns={columns} dataSource={dataSource} loading={loading} pagination={false} />
      <h1>Thành tiền: {totalAmount.toLocaleString()} VND</h1>
      <Button type="primary" onClick={handleCreateInvoice}>Thanh toán</Button>
    </>
  );
};

const InvoiceSummary: React.FC<{ invoiceDetails: ChiTietHDType[], totalAmount: number, tenHocVien: string, maHoaDon: string }> = ({ invoiceDetails, totalAmount, tenHocVien, maHoaDon }) => {
  const filteredInvoiceDetails = invoiceDetails.filter(item => item.maHoaDon === maHoaDon);

  const columns = [
    { title: 'Mã hóa đơn', dataIndex: 'maHoaDon', render: () => maHoaDon },
    { title: 'Học viên', dataIndex: 'tenHocVien', render: () => tenHocVien },
    { title: 'Mã nhân viên', dataIndex: 'maNhanVien' },
    { title: 'Tên nhân viên', dataIndex: 'tenNhanVien' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', render: (ngaySinh: string) => new Date(ngaySinh).toLocaleDateString() },
    { title: 'Học phí', dataIndex: 'hocPhi', render: () => totalAmount.toLocaleString() },
  ];

  return (
    <>
      <h1>Chi tiết hóa đơn</h1>
      <Table<ChiTietHDType> columns={columns} dataSource={filteredInvoiceDetails} pagination={false} />
    </>
  );
};
