import React, { useState } from 'react';
import { Modal, Spin, message, Form, Input, Button, Radio, Row, Col } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import moment from 'moment';

interface UserInfoModalProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onCancel, onLogout }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8081/api/nhanvien/thong-tin-ca-nhan',
        {
          ...values,
          maNhanVien: userInfo?.maNhanVien,
          ngaySinh: values.ngaySinh ? moment(values.ngaySinh).format('YYYY-MM-DD') : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success('Cập nhật thông tin cá nhân thành công!');
      onCancel();
    } catch (error) {
      message.error('Cập nhật thông tin cá nhân thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title="Thông Tin Người Dùng"
      style={{ top: 60, left: 0, margin: '0 auto' }}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...userInfo,
            ngayVaoLam: userInfo?.ngayVaoLam
              ? moment(userInfo.ngayVaoLam, 'YYYY-MM-DD').format('DD/MM/YYYY')
              : '',
            ngaySinh: userInfo?.ngaySinh
              ? moment(userInfo.ngaySinh, 'YYYY-MM-DD')
              : null,
          }}
          onFinish={handleUpdate}
        >
          <Row gutter={16}>
            {/* Cột bên trái */}
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item label="Mã Nhân Viên">
                    <Input disabled value={userInfo?.maNhanVien} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ngày Vào Làm">
                    <Input
                      disabled
                      value={
                        userInfo?.ngayVaoLam
                          ? moment(userInfo.ngayVaoLam, 'YYYY-MM-DD')
                            .add(1, 'days')
                            .format('DD/MM/YYYY')
                          : ''
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Chức Vụ">
                    <Input disabled value={userInfo?.chucVu} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Phân Quyền">
                    <Input
                      disabled
                      value={
                        userInfo?.phanQuyen === 1
                          ? 'Nhân Viên Quản Lý'
                          : userInfo?.phanQuyen === 2
                            ? 'Nhân Viên Thu Chi'
                            : 'Khác'
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="gioiTinh"
                    label="Giới Tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Radio.Group>
                      <Radio value="Nam">Nam</Radio>
                      <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Cột bên phải */}
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item label="Tên Nhân Viên">
                    <Input disabled value={userInfo?.tenNhanVien} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ngày Sinh">
                    <Input
                      disabled
                      value={
                        userInfo?.ngaySinh
                          ? moment(userInfo.ngaySinh, 'YYYY-MM-DD')
                            .add(1, 'days')
                            .format('DD/MM/YYYY')
                          : ''
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="sdt"
                    label="Số Điện Thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="diaChi" label="Địa Chỉ">
                    <Input placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: '91%', top: '20px', transform: 'translateX(-50%)' }}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default UserInfoModal;
