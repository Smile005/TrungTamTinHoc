import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, message } from 'antd';
import '../styles/LoginCustom.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const apiPort = process.env.REACT_APP_API_PORT || 8081;
      const response = await fetch(`http://localhost:${apiPort}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maNhanVien: values.username,
          matKhau: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const nhanVien = data.nhanVien;

        // Tạo userInfo object từ dữ liệu trả về
        const userInfo = {
          maNhanVien: nhanVien.maNhanVien,
          tenNhanVien: nhanVien.tenNhanVien,
          img: nhanVien.img,
          chucVu: nhanVien.chucVu,
          ngayVaoLam: nhanVien.ngayVaoLam,
          gioiTinh: nhanVien.gioiTinh,
          ngaySinh: nhanVien.ngaySinh,
          sdt: nhanVien.sdt,
          email: nhanVien.email,
          diaChi: nhanVien.diaChi,
          trangThai: nhanVien.trangThai,
          ghiChu: nhanVien.ghiChu,
          phanQuyen: nhanVien.phanQuyen,
        };

        // Dispatch action login với token và userInfo
        dispatch(login({ token, userInfo }));

        message.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        message.error('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '10px'
      }}>
        <img
          style={{ width: '50px', height: '50px', marginTop: '5px', borderRadius: '15px', marginLeft: '30px' }}
          src="https://res.cloudinary.com/dhyt592i7/image/upload/v1727774226/u5hvgxq11k3swhd7ca43.png"
          alt="Logo"
        />
        <h1 style={{ color: '#3a99d8', marginLeft: '15px' }}>Trung Tâm Prometheus</h1>
      </div>

      {/* Phần chính của trang login */}
      <div className="login-container">
        <div className="login-left">
          <div className="item-left">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img
                src="https://res.cloudinary.com/dhyt592i7/image/upload/v1731508891/ydjbjkrqqduuw9t33u5t.png"
                alt="Đăng nhập"
                style={{ width: '150px', height: '150px' }}
              />
            </div>
            <Form onFinish={onFinish}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}>
                <Input placeholder=" Nhập Mã Nhân Viên" />
              </Form.Item>
              <Form.Item
                name="password"
                className="input-pw"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password placeholder="Nhập Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-submit-btn" loading={loading}>
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="login-right">
          <img
            src="https://res.cloudinary.com/dhyt592i7/image/upload/v1727878177/lt560sdyxlhgj8gvy5da.png"
            alt="Login Illustration"
            className="login-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;