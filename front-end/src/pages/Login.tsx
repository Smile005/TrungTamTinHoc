import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, message } from 'antd';
import '../styles/LoginCustom.css';

interface LoginProps {
    setIsAuthenticated: (authenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values: { username: string; password: string }) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (values.username === 'admin' && values.password === '123') {
                message.success('Đăng nhập thành công!');
                setIsAuthenticated(true);
                navigate('/');
            } else {
                message.error('Sai tài khoản hoặc mật khẩu!');
            }
        }, 1000);
    };

    return (
        <div className="login-page">
            <div className="login-form">
                <div className='login-txt'><h1>Đăng Nhập</h1></div>
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
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