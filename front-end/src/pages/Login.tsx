// src/pages/Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice'; // Import login action
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, message } from 'antd';
import '../styles/LoginCustom.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const apiPort = process.env.REACT_APP_API_PORT;
      const response = await fetch(`http://localhost:${apiPort}/auth/login`, {
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
        const token = data.token; // Token from API response

        // Dispatch login action with the token
        dispatch(login(token));
        message.success('Đăng nhập thành công!');
        navigate('/'); // Redirect to home page after successful login
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
    <div className="login-page">
      <div className="login-form">
        <div className='login-txt'><h1>Đăng Nhập</h1></div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <a href="/forgot-password" style={{ float: 'right' }}>Forgot Password?</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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
