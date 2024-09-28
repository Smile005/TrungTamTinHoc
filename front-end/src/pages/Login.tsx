import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, message } from 'antd';
import axios from 'axios';
import '../styles/LoginCustom.css';

interface LoginProps {
  setIsAuthenticated: (authenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý submit form đăng nhập
  const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/api/login', {
        maNhanVien: values.username,  
        matKhau: values.password,     
      });

      if (response.status === 200) {
        message.success('Đăng nhập thành công!');
        
        setIsAuthenticated(true);

        if (values.remember) {
          localStorage.setItem('authenticated', 'true');
        } else {
          localStorage.removeItem('authenticated');
        }

        navigate('/'); // Điều hướng đến trang chính
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        message.error('Sai tài khoản hoặc mật khẩu!');
      } else {
        message.error('Có lỗi xảy ra! Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <div className="login-txt">
          <h1>Đăng Nhập</h1>
        </div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}>
            <Input placeholder="Tên tài khoản" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <a href="/forgot-password" style={{ float: 'right' }}>Forgot Password?</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="login-image">
        <img
          src="https://res.cloudinary.com/dhyt592i7/image/upload/v1727456258/yfdoz0fxkdpcnitiuosm.png"
          alt="Login Illustration"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default Login;
