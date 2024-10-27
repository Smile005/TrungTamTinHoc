import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Select, Steps, Table, message, theme } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';
import { HocVienType } from '../types/HocVienType';
import { ChiTietHDType } from '../types/HoaDonType';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DangKyLopHocProps {
  visible: boolean;
  onCancel: () => void;
  hocVien: HocVienType;
}

const DangKyLopHoc: React.FC<DangKyLopHocProps> = ({ visible, onCancel, hocVien }) => {
  const { token } = theme.useToken();
  const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string, trangThai: string }[]>([]);
  const [lopHocList, setLopHocList] = useState<{ maLopHoc: string, tenLopHoc: string, maMonHoc: string, soLuongHV: number, soLuong: number, trangThai: string }[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selectedMonHoc, setSelectedMonHoc] = useState<string | undefined>(undefined);
  const [selectedLopHoc, setSelectedLopHoc] = useState<string | undefined>(undefined);
  const [registeredClasses, setRegisteredClasses] = useState<{ maLopHoc: string; tenLopHoc: string; trangThai: string }[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const steps = [
    {
      title: 'Bước 1: Danh sách đăng ký',
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
      content: <HoaDonForm hocVien={hocVien} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />,
    },
    {
      title: 'Bước 3: Thông tin hóa đơn',
      content: 'Xem lại và xác nhận thông tin hóa đơn',
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

        setMonHocList(monHocResponse.data);
        setLopHocList(lopHocResponse.data);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu');
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
    <Modal title="Đăng ký khóa học" open={visible} onCancel={handleCancel} footer={null} width={1000}>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && <Button type="primary" onClick={next}>Next</Button>}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              message.success('Processing complete!');
              onCancel();
            }}
          >
            Done
          </Button>
        )}
        {current > 0 && <Button style={{ margin: '0 8px' }} onClick={prev}>Previous</Button>}
      </div>
    </Modal>
  );
};

export default DangKyLopHoc;

const LopHocForm: React.FC<{
  hocVien: HocVienType;
  monHocList: { maMonHoc: string; tenMonHoc: string; trangThai: string }[];
  lopHocList: { maLopHoc: string; tenLopHoc: string; maMonHoc: string; soLuongHV: number; soLuong: number; trangThai: string }[];
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
    {
      title: 'Mã lớp học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: { maLopHoc: string }) => (
        <Button
          type="link"
          onClick={() => handleDeleteLopHoc(record.maLopHoc)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const dangKy = async () => {
    if (!selectedLopHoc || !hocVien.maHocVien) {
      message.error('Vui lòng chọn lớp học và học viên.');
      return;
    }

    if (selectedLopHocObj && selectedLopHocObj.soLuongHV >= selectedLopHocObj.soLuong) {
      message.warning('Lớp học đã full. Vui lòng chọn lớp khác.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:8081/api/lophoc/xepLop',
        {
          maLopHoc: selectedLopHoc,
          maHocVien: hocVien.maHocVien,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      message.success('Đăng ký lớp học thành công!');

      setRegisteredClasses([
        ...lopHocDaDangKy,
        {
          maLopHoc: selectedLopHocObj?.maLopHoc || '',
          tenLopHoc: selectedLopHocObj?.tenLopHoc || '',
          trangThai: 'Chưa đóng học phí',
        },
      ]);
      setSelectedMonHoc(undefined);
      setSelectedLopHoc(undefined);
    } catch (error) {
      message.error('Đăng ký lớp học thất bại');
    }
  };

  const handleDeleteLopHoc = async (maLopHoc: string) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete('http://localhost:8081/api/lophoc/xoaXepLop', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          maLopHoc: maLopHoc,
          maHocVien: hocVien.maHocVien,
        },
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
      <p>
        <span>Mã học viên: {hocVien.maHocVien} - </span>
        <span>Tên học viên: {hocVien.tenHocVien} - </span>
        <span>Giới tính: {hocVien.gioiTinh}</span>
      </p>
      <p>
        <span>Ngày vào học: {hocVien.ngayVaoHoc} - </span>
        <span>Ngày sinh: {hocVien.ngaySinh} - </span>
        <span>Số điện thoại: {hocVien.sdt}</span>
      </p>
      <p>
        <span>Email: {hocVien.email} - </span>
        <span>Địa chỉ: {hocVien.diaChi} - </span>
        <span>Tình trạng: {hocVien.tinhTrang}</span>
      </p>

      <h1>Danh sách đăng ký</h1>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
            <Col span={12}>
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
            <Col span={12}>
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
            <Input
              addonBefore="Số lượng đăng ký"
              value={selectedLopHocObj ? `${selectedLopHocObj.soLuongHV} / ${selectedLopHocObj.soLuong}` : ''}
              disabled
            />
            <Input
              addonBefore="Trạng thái"
              value={selectedLopHocObj ? selectedLopHocObj.trangThai : ''}
              disabled
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'space-between', marginLeft: '20px' }}>
          <Button
            type="primary"
            style={{ marginTop: '5px' }}
            onClick={dangKy}
          >
            Đăng ký
          </Button>
        </div>
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
}> = ({ hocVien, selectedRowKeys, setSelectedRowKeys }) => {
  const [dataSource, setDataSource] = useState<ChiTietHDType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const maNhanVien = "NV0001"; // Mã nhân viên cần được lấy từ hệ thống hoặc context thực tế
  const ngayTaoHoaDon = new Date().toISOString(); // Lấy ngày tạo hóa đơn hiện tại

  const columns = [
    {
      title: 'Mã lớp học',
      dataIndex: 'maLopHoc',
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'tenLopHoc',
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      render: (hocPhi: number) => hocPhi.toLocaleString(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedRows = dataSource.filter((item) =>
      newSelectedRowKeys.includes(item.maLopHoc)
    );
    const total = selectedRows.reduce((sum, row) => sum + row.hocPhi, 0);
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
      const chiTietHD = selectedRowKeys.map((maLopHoc) => ({
        maLopHoc: maLopHoc as string,
      }));
       
      const payload = {
        maNhanVien: maNhanVien, // Mã nhân viên cố định
        maHocVien: hocVien.maHocVien, // Lấy mã học viên từ props
        ngayTaoHoaDon: ngayTaoHoaDon, // Ngày tạo hóa đơn hiện tại
        trangThai: 'Đã thanh toán', // Trạng thái hóa đơn
        chiTietHD: chiTietHD, // Danh sách chi tiết hóa đơn
      };

      const token = localStorage.getItem('token'); // Lấy token từ localStorage

      await axios.post('http://localhost:8081/api/hoadon/them-hoadon', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('Tạo hóa đơn thành công!');
    } catch (error) {
      console.error('Error details:', error);
      console.log('Dòng đã chọn khi có lỗi:', selectedRowKeys);
      message.error('Lỗi khi tạo hóa đơn');
   }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8081/api/lophoc/ds-theo-maHV/${hocVien.maHocVien}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const dataWithKeys = response.data.map((item: any, index: number) => ({
          ...item,
          key: item.maLopHoc, // Đảm bảo có key duy nhất
        }));

        setDataSource(dataWithKeys);
        setLoading(false);
      } catch (error) {
        message.error('Không thể lấy danh sách lớp học');
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
      <p>
        <span>Mã nhân viên: {maNhanVien} - </span>
        <span>Tên nhân viên: </span>
      </p>
      <p>
        <span>Mã học viên: {hocVien.maHocVien} - </span>
        <span>Tên học viên: {hocVien.tenHocVien}</span>
      </p>
      <p>
        <span>Ngày tạo hóa đơn: {ngayTaoHoaDon}</span>
      </p>
      <h1>Chi tiết hóa đơn</h1>
      <Table<ChiTietHDType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
      />
      <h1>Thành tiền: {totalAmount.toLocaleString()} VND</h1>
      <Button type="primary" onClick={handleCreateInvoice}>Tạo hóa đơn</Button>
    </>
  );
};
