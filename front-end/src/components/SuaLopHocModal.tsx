import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { LopHocType } from '../types/LopHocType';

interface SuaLopHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: LopHocType) => void;
  initialValues: LopHocType | null;
}

const SuaLopHocModal: React.FC<SuaLopHocModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [monHocList, setMonHocList] = useState<{ maMonHoc: string; tenMonHoc: string; trangThai: string }[]>([]);
  const [nhanVienList, setNhanVienList] = useState<{ maNhanVien: string; tenNhanVien: string; trangThai: string }[]>([]);

  useEffect(() => {
    if (visible) {
      // Fetch danh sách môn học
      axios
        .get('http://localhost:8081/api/monhoc/ds-monhoc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const activeMonHoc = response.data.filter((monHoc: any) => monHoc.trangThai !== 'Tạm Ngưng');
          setMonHocList(activeMonHoc);
        })
        .catch((error) => message.error('Lỗi khi lấy danh sách môn học: ' + error.message));

      // Fetch danh sách giảng viên
      axios
        .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const giangVienData = response.data.filter((nhanVien: any) => nhanVien.chucVu === 'Giảng Viên' && nhanVien.trangThai !== 'Đã Nghỉ');
          setNhanVienList(giangVienData);
        })
        .catch((error) => message.error('Lỗi khi lấy danh sách giảng viên: ' + error.message));
    }

    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        ngayBatDau: initialValues.ngayBatDau ? moment(initialValues.ngayBatDau, 'YYYY-MM-DD') : null,
      });
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : null,
        };

        axios
          .post('http://localhost:8081/api/lophoc/sua-lophoc', formattedValues, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            message.success('Cập nhật lớp học thành công.');
            onSubmit(formattedValues);
            form.resetFields();
            onCancel();
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              message.error('Lỗi: ' + (error.response.data.message || 'Không thể cập nhật lớp học.'));
            } else {
              message.error('Lỗi khi cập nhật lớp học: ' + error.message);
            }
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Lớp Học"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      style={{ bottom: 20 }}
    >
      <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {/* Cột 1 */}
            <Col span={12}>
              <Form.Item name="maLopHoc" label="Mã Lớp Học">
                <Input disabled placeholder="Mã lớp học tự động" />
              </Form.Item>
              <Form.Item
                name="maNhanVien"
                label="Giảng Viên"
                rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
              >
                <Select placeholder="Chọn giảng viên">
                  {nhanVienList.map((nhanVien) => (
                    <Select.Option key={nhanVien.maNhanVien} value={nhanVien.maNhanVien}>
                      {nhanVien.tenNhanVien}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="soLuongMax"
                label="Số Lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng tối đa" />
              </Form.Item>
              <Form.Item
                name="ngayBatDau"
                label="Ngày Bắt Đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* Cột 2 */}
            <Col span={12}>
              <Form.Item
                name="tenLopHoc"
                label="Tên Lớp Học"
                rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}
              >
                <Input placeholder="Nhập tên lớp học" />
              </Form.Item>
              <Form.Item
                name="maMonHoc"
                label="Môn Học"
                rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
              >
                <Select placeholder="Chọn môn học">
                  {monHocList.map((monHoc) => (
                    <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                      {`${monHoc.maMonHoc} - ${monHoc.tenMonHoc}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="trangThai"
                label="Tình Trạng"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
              >
                <Select placeholder="Chọn tình trạng lớp học">
                  <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
                  <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="ghiChu"
                label="Ghi Chú"
              >
                <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default SuaLopHocModal;
