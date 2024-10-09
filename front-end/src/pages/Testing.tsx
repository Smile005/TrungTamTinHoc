import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message, Row, Col, Steps, theme } from 'antd';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';

const AddLopHoc: React.FC = () => {
  const { token } = theme.useToken();
  const [formLopHoc] = Form.useForm();
  const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string }[]>([]);
  const [nhanVienList, setNhanVienList] = useState<{ maNhanVien: string, tenNhanVien: string }[]>([]);
  const [caHocList, setCaHocList] = useState<{ maCaHoc: string, batDau: string, ketThuc: string }[]>([]);
  const [phongHocList, setPhongHocList] = useState<{ maPhong: string, soLuong: number }[]>([]);

  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const steps = [
    {
      title: 'Tạo Lớp Học',
      content: renderHocVienForm(formLopHoc, monHocList, nhanVienList),
    },
    {
      title: 'Thêm Lịch Học',
      content: renderLichHocForm(),
      description: 'Có thể bỏ qua',
    },
    {
      title: 'Thêm Học Viên',
      content: 'Có thể bỏ qua',
      description: 'Có thể bỏ qua',
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/monhoc/ds-monhoc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setMonHocList(response.data);
      })
      .catch((error) => {
        message.error('Lỗi khi lấy danh sách môn học: ' + error.message);
      });

    axios
      .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        const giangVienData = response.data.filter((nhanVien: any) => nhanVien.chucVu === 'Giảng Viên');
        setNhanVienList(giangVienData);
      })
      .catch((error) => {
        message.error('Lỗi khi lấy danh sách giảng viên: ' + error.message);
      });

    axios
      .get('http://localhost:8081/api/cahoc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setCaHocList(response.data);
      })
      .catch((error) => {
        message.error('Lỗi khi lấy danh sách ca học: ' + error.message);
      });

    axios
      .get('http://localhost:8081/api/phonghoc/ds-phong', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setPhongHocList(response.data);
      })
      .catch((error) => {
        message.error('Lỗi khi lấy danh sách phòng học: ' + error.message);
      });
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleOk = () => {
    message.success('Processing complete!');
    setIsModalVisible(false);
    setCurrent(0); // Reset bước về 0 khi đóng modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrent(0); // Reset bước về 0 khi đóng modal
  };

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Mở Modal
      </Button>
      <Modal
        title="Quá Trình Tạo Lớp Học"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <div>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleOk}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                Previous
              </Button>
            )}
          </div>
          <div>
            <Button type="primary" onClick={() => setCurrent(0)}>
              Reset
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddLopHoc;

const renderHocVienForm = (
  form: any,
  monHocList: { maMonHoc: string, tenMonHoc: string }[],
  nhanVienList: { maNhanVien: string, tenNhanVien: string }[]
) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="maMonHoc"
      label="Môn Học"
      rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
    >
      <Select placeholder="Chọn Môn Học">
        {monHocList.map((monHoc) => (
          <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
            {monHoc.maMonHoc} - {monHoc.tenMonHoc}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name="maNhanVien"
      label="Giảng Viên"
      rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
    >
      <Select placeholder="Chọn Giảng Viên">
        {nhanVienList.map((nhanVien) => (
          <Select.Option key={nhanVien.maNhanVien} value={nhanVien.maNhanVien}>
            {nhanVien.maNhanVien} - {nhanVien.tenNhanVien}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="ngayBatDau"
          label="Ngày Bắt Đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="soLuong"
          label="Số Lượng"
          initialValue={30}
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item
      name="trangThai"
      label="Tình Trạng"
      rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
    >
      <Select defaultValue="Chưa mở đăng ký">
        <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
        <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="ghiChu" label="Ghi Chú">
      <Input.TextArea rows={4} />
    </Form.Item>
  </Form>
);

const renderLichHocForm = () => {
  return (
          <Form layout="vertical">
              <Row gutter={16}>
                  <Col span={12}>
                      <Form.Item
                          name="thu"
                          label="Thứ"
                          rules={[{ required: true, message: 'Vui lòng chọn thứ!' }]}
                      >
                          <Select placeholder="Chọn thứ">
                              <Select.Option value="Hai">Thứ Hai</Select.Option>
                              <Select.Option value="Ba">Thứ Ba</Select.Option>
                              <Select.Option value="Tu">Thứ Tư</Select.Option>
                              <Select.Option value="Nam">Thứ Năm</Select.Option>
                              <Select.Option value="Sau">Thứ Sáu</Select.Option>
                              <Select.Option value="Bay">Thứ Bảy</Select.Option>
                              <Select.Option value="CN">Chủ Nhật</Select.Option>
                          </Select>
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          name="caHoc"
                          label="Ca Học"
                          rules={[{ required: true, message: 'Vui lòng chọn ca học!' }]}
                      >
                          <Select placeholder="Chọn ca học">
                              {/* Populate with caHocList if available */}
                              <Select.Option value="Sang">Sáng</Select.Option>
                              <Select.Option value="Chieu">Chiều</Select.Option>
                              <Select.Option value="Toi">Tối</Select.Option>
                          </Select>
                      </Form.Item>
                  </Col>
              </Row>
              <Row gutter={16}>
                  <Col span={12}>
                      <Form.Item
                          name="phongHoc"
                          label="Phòng Học"
                          rules={[{ required: true, message: 'Vui lòng chọn phòng học!' }]}
                      >
                          <Select placeholder="Chọn phòng học">
                              {/* Populate with phongHocList if available */}
                              <Select.Option value="Phong101">Phòng 101</Select.Option>
                              <Select.Option value="Phong102">Phòng 102</Select.Option>
                              <Select.Option value="Phong103">Phòng 103</Select.Option>
                          </Select>
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          name="giangVien"
                          label="Giáo Viên"
                          rules={[{ required: true, message: 'Vui lòng chọn giáo viên!' }]}
                      >
                          <Select placeholder="Chọn giáo viên">
                              {/* Populate with nhanVienList if available */}
                              <Select.Option value="GV001">Giáo viên 001</Select.Option>
                              <Select.Option value="GV002">Giáo viên 002</Select.Option>
                              <Select.Option value="GV003">Giáo viên 003</Select.Option>
                          </Select>
                      </Form.Item>
                  </Col>
              </Row>
              <Row gutter={16}>
                  <Col span={12}>
                      <Form.Item
                          name="ngayBatDau"
                          label="Ngày Bắt Đầu"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                      >
                          <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          name="ngayKetThuc"
                          label="Ngày Kết Thúc"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                      >
                          <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                  </Col>
              </Row>
              <Form.Item
                  name="soBuoi"
                  label="Số Buổi"
                  rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
              >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="Số buổi" />
              </Form.Item>
              <Form.Item>
                  <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
                      Thêm Thời Khóa Biểu
                  </Button>
              </Form.Item>
          </Form>
  );
};