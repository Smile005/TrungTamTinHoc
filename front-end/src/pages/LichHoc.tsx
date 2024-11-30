import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Button, Menu, Dropdown, DatePicker, DatePickerProps, Radio, RadioChangeEvent, ConfigProvider, Badge } from 'antd';
import { CalendarOutlined, LeftOutlined, MoreOutlined, PlusOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CalendarProps } from 'antd/es/calendar';
import axios from 'axios';
import { BuoiHocType } from '../types/BuoiHocType';
import dayjs, { type Dayjs } from 'dayjs';
import SuaBuoiHocModal from '../components/SuaBuoiHocModal';
import "../styles/ButtonCustom.css";
import '../styles/TableCustom.css';
import { Tooltip } from 'antd';

const LichHoc: React.FC = () => {
  const [isLichHocVisible, setIsLichHocVisible] = useState(false);
  const [isSuaBuoiHocVisible, setIsSuaBuoiHocVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedBuoiHoc, setSelectedBuoiHoc] = useState<BuoiHocType | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [listData, setListData] = useState<BuoiHocType[]>([]);
  const [filteredData, setFilteredData] = useState(listData);
  const [radio, setRadio] = useState(1);

  // Lấy dữ liệu cho tháng hiện tại khi vào trang
  useEffect(() => {
    // Gọi API để lấy dữ liệu cho tháng hiện tại
    getListData(currentDate).then((data) => setListData(data));
  }, [currentDate]); // Chạy lại mỗi khi `currentDate` thay đổi

  // Lấy dữ liệu từ API
  const getListData = async (date: Dayjs | null) => {
    // Kiểm tra nếu date là null hoặc không hợp lệ
    if (!date) {
      console.error("Invalid date provided");
      return [];  // Trả về mảng rỗng nếu ngày không hợp lệ
    }

    const month = date.month() + 1; // Lấy tháng từ 1 đến 12
    const year = date.year();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token not found in localStorage");
        return [];
      }

      const response = await axios.get(`http://localhost:8081/api/lichhoc/getBuoiHocByThang?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra xem response có dữ liệu hay không
      if (response && response.data) {
        return response.data; // Giả sử API trả về mảng BuoiHocType
      } else {
        console.error("No data received from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];  // Trả về mảng rỗng nếu có lỗi khi gọi API
    }
  };

  const handleTodayClick = () => {
    const today = dayjs();
    setCurrentDate(today);
  };

  const handleSelect = (value: Dayjs) => {
    setSelectedDate(value);
    setCurrentDate(value);
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
      case 'details':
        console.log("Hiển thị thông tin chi tiết buổi học");
        break;
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
        console.log("Chức năng được chọn trong menu không thể xác định");
        break;
    }
  };
  const handleSaveUpdatedBuoiHoc = (updatedBuoiHoc: BuoiHocType) => {
    // Cập nhật listData với buổi học đã sửa
    setListData((prevData) => {
      return prevData.map((item) =>
        item.maLopHoc === updatedBuoiHoc.maLopHoc && item.maCa === updatedBuoiHoc.maCa
          ? { ...item, ...updatedBuoiHoc, isUpdated: true } // Thêm trường isUpdated
          : item
      );
    });
    setIsSuaBuoiHocVisible(false); // Đóng modal sửa
  };


  const menu = (
    <Menu>
      <Menu.Item key="details" onClick={() => handleMenuClick('details')}>
        Thông tin chi tiết
      </Menu.Item>
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

  const dateCellRender = (value: Dayjs) => {
    const listDataForDay = listData.filter((item) => dayjs(item.ngayHoc).isSame(value, 'day'));
    return (
      <ul className="events">
        {listDataForDay.map((item: BuoiHocType) => (
          <li
            key={`${item.maLopHoc}-${item.maCa}-${item.maPhong}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <div
              className="custom-label"
              style={{
                backgroundColor: item.loai === 'Ngày học' ? '#33CCFF'
                  : item.loai === 'Ngày thi' ? '#CCCC33'
                    : '',
              }}
            >
              {item.tenLopHoc}
            </div>

          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const radioChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setRadio(value);

    if (value === 1) {
      setFilteredData(listData);
    } else if (value === 2) {
      setFilteredData(listData.filter(item => item.loai === 'Ngày học'));
    } else if (value === 3) {
      setFilteredData(listData.filter(item => item.loai === 'Ngày thi'));
    }
  };

  const datePickerChange: DatePickerProps['onChange'] = (date, dateString) => {
    setCurrentDate(date)
  };

  const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, type, onChange, onTypeChange }) => {
    return null; // No rendering of header
  };

  const handleTroVeClick = () => {
    const newDate = currentDate.subtract(1, 'month');  // Dùng dayjs để trừ đi 1 tháng
    setCurrentDate(newDate);
  }

  const handleTiepClick = () => {
    const newDate = currentDate.add(1, 'month');  // Dùng dayjs để trừ đi 1 tháng
    setCurrentDate(newDate);
  }

  return (
    <>
      <div className="custom-container">
        <Radio.Group onChange={radioChange} value={radio}>
          <Radio value={1}>Tất cả</Radio>
          <Radio value={2}>Lịch học</Radio>
          <Radio value={3}>Lịch thi</Radio>
        </Radio.Group>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <DatePicker onChange={datePickerChange} value={currentDate} format="DD/MM/YYYY" />
          <Tooltip title="Màu xanh là lịch học không có màu là lịch thi" className='top-tip'>
            <ExclamationCircleOutlined />
          </Tooltip>
          <Button className="custom-button" icon={<CalendarOutlined />} onClick={handleTodayClick}>Hiện tại</Button>
        </div>
        <Button className="custom-button" icon={<LeftOutlined />} onClick={handleTroVeClick}>Trở về</Button>
        <Button className="custom-button" icon={<RightOutlined />} onClick={handleTiepClick}>Tiếp</Button>
        {/* <Button className="custom-button" icon={<PlusOutlined />}>Thêm lịch</Button> */}
      </div>
      <ConfigProvider>
        <div className="calendar-wrapper">
          <Calendar
            value={currentDate}
            cellRender={cellRender}
            headerRender={headerRender}
            onSelect={handleSelect}
          />
        </div>
      </ConfigProvider>

      <Modal
        title={`Chi tiết ngày ${selectedDate?.format('DD/MM/YYYY')}`}
        open={isLichHocVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {listData.length > 0 ? (
          <div>
            <ul>
              {listData
                .filter((item: BuoiHocType) => {
                  return dayjs(item.ngayHoc).isSame(selectedDate, 'day');
                })
                .map((item: BuoiHocType) => (
                  <li
                    key={`${item.maLopHoc}-${item.maCa}-${item.maPhong}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #e8e8e8',
                    }}
                  >
                    <div className='custom-label'
                      style={{
                        backgroundColor: item.loai === 'Ngày học' ? '#33CCFF'
                          : item.loai === 'Ngày thi' ? '#CCCC33'
                            : '',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>
                        Lớp: {item.tenLopHoc}
                      </span>
                      <span style={{ display: 'block' }}>
                        Ca: {item.maCa} - Phòng: {item.maPhong}
                      </span>
                      <span style={{ display: 'block' }}>
                        GV: {item.tenGiaoVien}
                      </span>
                      <span style={{ display: 'block' }}>
                        Ghi Chú: {item.ghiChu}
                      </span>
                    </div>
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
