import React, { useEffect, useState } from 'react';
import { Modal, Table, Spin, message, Form, Input, Button, DatePicker, Select, Radio } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { NhanVienType } from '../types/NhanVienType';
import moment from 'moment';

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, onLogout }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [nhanVien, setNhanVien] = useState<NhanVienType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTaiKhoan = async () => {
      if (userInfo && userInfo.maNhanVien) {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const danhSachTaiKhoan: NhanVienType[] = response.data;
          const nhanVienData = danhSachTaiKhoan.find(tk => tk.maNhanVien === userInfo.maNhanVien);
          setNhanVien(nhanVienData || null);

          if (nhanVienData) {
            form.setFieldsValue({
              ...nhanVienData,
              ngaySinh: nhanVienData.ngaySinh ? moment(nhanVienData.ngaySinh, 'YYYY-MM-DD') : null,
              ngayVaoLam: nhanVienData.ngayVaoLam ? moment(nhanVienData.ngayVaoLam, 'YYYY-MM-DD') : null, 
            });
          }
        } catch (error) {
          message.error('Lỗi khi lấy thông tin tài khoản');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaiKhoan();
  }, [userInfo, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        maNhanVien: nhanVien?.maNhanVien,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
        ngayVaoLam: values.ngayVaoLam ? values.ngayVaoLam.format('YYYY-MM-DD') : null, 
      };

      await axios.post('http://localhost:8081/api/nhanvien/sua-nhanvien', formattedValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('Cập nhật thông tin thành công');
      onCancel();
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
    }
  };

  const columns = [
    {
      title: 'Thông Tin',
      dataIndex: 'key',
      key: 'key',
      width: '50%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Giá Trị',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
  ];

  const tableData = nhanVien
    ? [
      { key: 'Mã Nhân Viên', value: nhanVien.maNhanVien },
      { key: 'Tên Nhân Viên', value: <Form.Item style={{ height: '8px' }} name="tenNhanVien" rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}><Input /></Form.Item> },
      { key: 'Chức Vụ', value: <Form.Item style={{ height: '8px' }} name="chucVu" rules={[{ required: true, message: 'Vui lòng chọn!' }]}><Select><Select.Option value="Giảng Viên">Giảng Viên</Select.Option><Select.Option value="Nhân Viên">Nhân Viên</Select.Option></Select></Form.Item> },
      { key: 'Giới Tính', value: <Form.Item style={{ height: '8px' }} name="gioiTinh"><Radio.Group><Radio value="Nam">Nam</Radio><Radio value="Nữ">Nữ</Radio></Radio.Group></Form.Item> },
      { key: 'Ngày Vào Làm', value: <Form.Item style={{ height: '8px' }} name="ngayVaoLam" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}><DatePicker style={{ width: '100%' }} /></Form.Item> },
      { key: 'Ngày Sinh', value: <Form.Item style={{ height: '8px' }} name="ngaySinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}><DatePicker style={{ width: '100%' }} /></Form.Item> },
      { key: 'Số Điện Thoại', value: <Form.Item style={{ height: '8px' }} name="sdt"><Input /></Form.Item> },
      { key: 'Email', value: <Form.Item style={{ height: '8px' }} name="email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}><Input /></Form.Item> },
      { key: 'Địa Chỉ', value: <Form.Item style={{ height: '8px' }} name="diaChi"><Input /></Form.Item> },
      { key: 'Trạng Thái', value: <Form.Item style={{ height: '8px' }} name="trangThai" rules={[{ required: true, message: 'Vui lòng chọn!' }]}><Select><Select.Option value="Full time">Full time</Select.Option><Select.Option value="Part time">Part time</Select.Option><Select.Option value="Thực tập sinh">Thực tập sinh</Select.Option></Select></Form.Item> },
    ]
    : [];


  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="Thông Tin Người Dùng"
      style={{ top: 0, left: 0, margin: '0 auto' }} 
      bodyStyle={{ padding: 0 }} 
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            rowKey="key"
            bordered
            showHeader={false}
            style={{ marginTop: '16px' }}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: '385px', top: '20px' }}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default UserInfoModal;
