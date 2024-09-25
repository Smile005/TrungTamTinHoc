import React, { useState } from 'react';
import { Calendar, Modal, Button, Menu, Dropdown, type CalendarProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { BuoiHocType } from '../types/BuoiHocType';
import dayjs, { type Dayjs } from 'dayjs';
import SuaBuoiHocModal from '../components/SuaBuoiHocModal';
import "../styles/ButtonCustom.css";

const LichHoc: React.FC = () => {
  const [isLichHocVisible, setIsLichHocVisible] = useState(false);
  const [isSuaBuoiHocVisible, setIsSuaBuoiHocVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedBuoiHoc, setSelectedBuoiHoc] = useState<BuoiHocType | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [listData, setListData] = useState<BuoiHocType[]>([]);

  const handleTodayClick = () => {
    const today = dayjs();
    setCurrentDate(today);
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month" style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <section style={{ fontWeight: 'bold' }}>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.maBuoiHoc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>- {item.tenLopHoc}</span>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  const handleSelect = (value: Dayjs) => {
    const events = getListData(value);
    setSelectedDate(value);
    setListData(events);
    setIsLichHocVisible(true);
  };

  const handleOk = () => {
    setIsLichHocVisible(false);
  };

  const handleCancel = () => {
    setIsLichHocVisible(false);
    setIsSuaBuoiHocVisible(false);
  };

  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'editSchedule':
        console.log("Chỉnh sửa lịch học");
        break;
      case 'editMeeting':
        setIsSuaBuoiHocVisible(true);
        break;
      case 'deleteMeeting':
        console.log("Xóa buổi học");
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="editSchedule" onClick={() => handleMenuClick('editSchedule')}>
        Chỉnh sửa lịch học
      </Menu.Item>
      <Menu.Item key="editMeeting" onClick={() => handleMenuClick('editMeeting')}>
        Chỉnh sửa buổi học
      </Menu.Item>
      <Menu.Item key="deleteMeeting" onClick={() => handleMenuClick('deleteMeeting')} danger>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <h1 className='page-name'>QUẢN LÝ LỊCH HỌC</h1>
      <div className="custom-container">
        <Button className="custom-button" onClick={handleTodayClick}>Hoàn tác</Button>
        <Button className="custom-button" icon={<PlusOutlined />}>Thêm Buổi học</Button>
        <Button className="custom-button" icon={<PlusOutlined />}>Thêm Lịch học</Button>
      </div>
      <Calendar
        value={currentDate}
        cellRender={cellRender}
        onSelect={handleSelect}
      />
      <Modal
        title={`Details for ${selectedDate?.format('DD-MM-YYYY')}`}
        open={isLichHocVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {listData.length > 0 ? (
          <div>
            <ul>
              {listData.map((item) => (
                <li key={item.maBuoiHoc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    - {item.tenLopHoc} - {item.caHoc.maCa} - {item.phongHoc.maPhong} - {item.giaoVien.tenNhanVien}
                  </span>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<MoreOutlined />} />
                  </Dropdown>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No events for this day.</p>
        )}
        <Button className="custom-button" icon={<PlusOutlined />}>Thêm Buổi học</Button>
        <Button className="custom-button" icon={<PlusOutlined />}>Thêm Lịch học</Button>
      </Modal>

      <SuaBuoiHocModal
        visible={isSuaBuoiHocVisible}
        onCancel={() => setIsSuaBuoiHocVisible(false)}
        selectedBuoiHoc={selectedBuoiHoc}
        onSave={(updatedBuoiHoc) => {
          // Logic lưu thông tin ở đây, ví dụ cập nhật lại danh sách buổi học
          console.log('Thông tin buổi học đã được cập nhật:', updatedBuoiHoc);
        }}
      />
    </>
  );
};

export default LichHoc;

// Hàm lấy dữ liệu buổi học
const getListData = (value: Dayjs): BuoiHocType[] => {
  let listData: BuoiHocType[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        {
          maBuoiHoc: 'BH001',
          tenLopHoc: 'Lập trình Web',
          ngayHoc: value.toDate(),
          caHoc: {key: '1', maCa: 'CA01', batDau: "07:00", ketThuc: "10:00", trangThai: 'Đang hoạt động', ghiChu: 'Ca học bình thường' },
          phongHoc: {key: '1', maPhong: 'PH01', soLuong: 30, trangThai: 'Đang hoạt động', ghiChu: 'Phòng học lý thuyết' },
          giaoVien: { key: 'GV001', maNhanVien: 'NV001', tenNhanVien: 'Nguyễn Văn A', gioiTinh: 'nam', ngaySinh: '1990-01-01', tinhTrang: 'Đang làm việc' },
          loai: 'Ngày học',
          trangThai: 'Đã lên lịch',
          ghiChu: 'Học sinh cần chuẩn bị tài liệu',
        },
        {
          maBuoiHoc: 'BH002',
          tenLopHoc: 'Thi giữa kỳ',
          ngayHoc: value.toDate(),
          caHoc: { key: '1', maCa: 'CA02', batDau: "07:00", ketThuc: "10:00", trangThai: 'Đang hoạt động', ghiChu: 'Ca thi' },
          phongHoc: {key: '1', maPhong: 'PH02', soLuong: 30, trangThai: 'Đang hoạt động', ghiChu: 'Phòng thi' },
          giaoVien: { key: 'GV002', maNhanVien: 'NV002', tenNhanVien: 'Trần Thị B', gioiTinh: 'nữ', ngaySinh: '1992-05-15', tinhTrang: 'Đang làm việc' },
          loai: 'Ngày thi',
          trangThai: 'Đã lên lịch',
          ghiChu: 'Học sinh tham gia thi giữa kỳ',
        },
      ];
      break;
    case 10:
      listData = [
        {
          maBuoiHoc: 'BH003',
          tenLopHoc: 'Nghỉ lễ',
          ngayHoc: value.toDate(),
          caHoc: { key: '1', maCa: 'CA03', batDau: "07:00", ketThuc: "10:00", trangThai: 'Đang hoạt động', ghiChu: 'Ngày nghỉ lễ' },
          phongHoc: {key: '1', maPhong: 'PH03', soLuong: 30, trangThai: 'Ngưng hoạt động', ghiChu: 'Không có lớp' },
          giaoVien: { key: 'GV003', maNhanVien: 'NV003', tenNhanVien: 'Lê Văn C', gioiTinh: 'nam', ngaySinh: '1985-12-20', tinhTrang: 'Đang làm việc' },
          loai: 'Ngày nghỉ',
          trangThai: 'Đã lên lịch',
          ghiChu: 'Nghỉ lễ Quốc khánh',
        },
      ];
      break;
    default:
  }
  return listData || [];
};
