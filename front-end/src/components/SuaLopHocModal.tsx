import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { LopHocType } from '../types/LopHocType';

interface SuaLopHocModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: LopHocType) => void;
  initialValues: LopHocType | null; // Giá trị khởi tạo từ lớp học hiện có
}

const SuaLopHocModal: React.FC<SuaLopHocModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [maMonHocList, setMaMonHocList] = useState<string[]>([]);
  const [maNhanVienList, setMaNhanVienList] = useState<string[]>([]);

  useEffect(() => {
    // Lấy dữ liệu mã môn học và mã giảng viên khi modal được mở
    if (visible) {
      // Fetch danh sách mã môn học
      axios
        .get('http://localhost:8081/api/monhoc/ds-monhoc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const maMonHocData = response.data.map((monHoc: any) => monHoc.maMonHoc);
          setMaMonHocList(maMonHocData);
        })
        .catch((error) => {
          message.error('Lỗi khi lấy danh sách mã môn học: ' + error.message);
        });

      // Fetch danh sách mã giảng viên
      axios
        .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const giangVienData = response.data
            .filter((nhanVien: any) => nhanVien.chucVu === 'Giảng Viên')
            .map((nhanVien: any) => nhanVien.maNhanVien);
          setMaNhanVienList(giangVienData);
        })
        .catch((error) => {
          message.error('Lỗi khi lấy danh sách giảng viên: ' + error.message);
        });
    }

    // Set giá trị khởi tạo vào form
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

        // Gửi request cập nhật lớp học qua API
        axios
          .post(
            'http://localhost:8081/api/lophoc/sua-lophoc',
            formattedValues,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            message.success('Cập nhật lớp học thành công.');
            onSubmit(formattedValues); // Gọi hàm onSubmit để cập nhật danh sách lớp học
            form.resetFields(); // Reset form
            onCancel(); // Đóng modal
          })
          .catch((error) => {
            message.error('Lỗi khi cập nhật lớp học: ' + error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Sửa Lớp Học"
      visible={visible}
      onCancel={() => {
        form.resetFields(); // Reset form khi modal bị hủy
        onCancel(); // Gọi hàm onCancel từ component cha
      }}
      onOk={handleOk} // Xử lý khi bấm nút OK
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maLopHoc"
          label="Mã Lớp Học"
          rules={[{ required: true, message: 'Vui lòng nhập mã lớp học!' }]}
        >
          <Input disabled /> {/* Không cho phép thay đổi mã lớp học */}
        </Form.Item>
        <Form.Item
          name="tenLopHoc"
          label="Tên Lớp Học"
          rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="maMonHoc"
          label="Mã Môn Học"
          rules={[{ required: true, message: 'Vui lòng chọn mã môn học!' }]}
        >
          <Select placeholder="Chọn Mã Môn Học">
            {maMonHocList.map((maMonHoc) => (
              <Select.Option key={maMonHoc} value={maMonHoc}>
                {maMonHoc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="maNhanVien"
          label="Mã Giảng Viên"
          rules={[{ required: true, message: 'Vui lòng chọn mã giảng viên!' }]}
        >
          <Select placeholder="Chọn Mã Giảng Viên">
            {maNhanVienList.map((maNhanVien) => (
              <Select.Option key={maNhanVien} value={maNhanVien}>
                {maNhanVien}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ngayBatDau"
          label="Ngày Bắt Đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="soLuong"
          label="Số Lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="trangThai"
          label="Tình Trạng"
          rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
          <Select>
            <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
            <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi Chú">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuaLopHocModal;
