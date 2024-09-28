import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  ScheduleOutlined,
  BuildOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  UserOutlined,
  SolutionOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import HocVien from './pages/HocVien';
import NhanVien from './pages/NhanVien';
import LopHoc from './pages/LopHoc';
import TrangChu from './pages/TrangChu';
import MonHoc from './pages/MonHoc';
import LichHoc from './pages/LichHoc';
import HocVienTable from './pages/Testing';
import PhongHoc from './pages/PhongHoc';
import CaHoc from './pages/CaHoc';
import TaiKhoan from './pages/TaiKhoan';
import TKHocVien from './pages/TKHocVien';
import TKLopHoc from './pages/TKLopHoc';
import TKGiangVien from './pages/TKGiangVien';
import Login from './pages/Login'; // Import Login page
import './App.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Quản lý trạng thái đăng nhập
  const location = useLocation();

  // Kiểm tra nếu đường dẫn hiện tại là trang đăng nhập
  const isLoginPage = location.pathname === '/login';

  // Function to get the selected menu key based on the current path
  const getSelectedKey = () => {
    if (location.pathname === '/') return '0'; // Home page
    if (location.pathname.startsWith('/taikhoan')) return '1';
    if (location.pathname.startsWith('/nhanvien')) return '2';
    if (location.pathname.startsWith('/hocvien')) return '3';
    if (location.pathname.startsWith('/cahoc')) return '4';
    if (location.pathname.startsWith('/phonghoc')) return '5';
    if (location.pathname.startsWith('/monhoc')) return '6';
    if (location.pathname.startsWith('/lophoc')) return '7';
    if (location.pathname.startsWith('/lichhoc')) return '8';
    if (location.pathname.startsWith('/dangky')) return '9';
    if (location.pathname.startsWith('/ds_thi')) return '11';
    if (location.pathname.startsWith('/nhapdiem')) return '12';
    if (location.pathname.startsWith('/tk_hocvien')) return '13';
    if (location.pathname.startsWith('/tk_giangvien')) return '14';
    if (location.pathname.startsWith('/tk_lophoc')) return '15';
    return '0'; // Default to home page if no match
  };

  return (
    <Layout style={{ height: '100vh' }}> {/* Đảm bảo layout full chiều cao */}
      {/* Chỉ hiển thị Header và Sider khi không ở trang đăng nhập */}
      {!isLoginPage && (
        <>
          <Header className="custom-header" style={{ background: '#000', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <img
                style={{ width: '50px', height: '50px', marginTop: '5px', borderRadius: '15px' }}
                src="https://res.cloudinary.com/dhyt592i7/image/upload/v1726735463/s7noroyd5bk6whepwsbu.png"
                alt="Logo"
              />
              <Link to="/">
                <h1 style={{ color: 'white', marginLeft: '15px' }}>Trung Tâm Prometheus</h1>
              </Link>
            </div>
          </Header>

          <Layout>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              width={250}
              style={{ background: colorBgContainer, height: '100vh', overflow: 'auto' }} 
              trigger={
                <div className="custom-trigger">
                  {collapsed ? (
                    <MenuUnfoldOutlined style={{ color: '#fff', fontSize: '18px' }} />
                  ) : (
                    <MenuFoldOutlined style={{ color: '#fff', fontSize: '18px' }} />
                  )}
                </div>
              }
            >
              <Menu
                className="custom-menu"
                mode="inline"
                selectedKeys={[getSelectedKey()]} // Dynamically set selected keys
              >
                <Menu.Item key="0" icon={<AppstoreOutlined />}>
                  <Link to="/">Trang chủ</Link>
                </Menu.Item>
                <SubMenu key="group01" icon={<UserOutlined />} title="Tổ chức">
                  <Menu.Item key="1">
                    <Link to="/taikhoan">Tài khoản</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/nhanvien">Nhân viên</Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/hocvien">Học viên</Link>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <Link to="/cahoc">Ca học</Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/phonghoc">Phòng học</Link>
                  </Menu.Item>
                  <Menu.Item key="6">
                    <Link to="/monhoc">Môn học</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="group02" icon={<ScheduleOutlined />} title="Lập kế hoạch">
                  <Menu.Item key="7">
                    <Link to="/lophoc">Lớp học</Link>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <Link to="/lichhoc">Lịch học</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="group03" icon={<SolutionOutlined />} title="Ghi danh">
                  <Menu.Item key="9">
                    <Link to="/dangky">Đăng ký</Link>
                  </Menu.Item>
                  <Menu.Item key="10">
                    <Link to="/ds_lop">Danh sách lớp</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="group04" icon={<ReadOutlined />} title="Thi">
                  <Menu.Item key="11">
                    <Link to="/ds_thi">Danh sách lịch thi</Link>
                  </Menu.Item>
                  <Menu.Item key="12">
                    <Link to="/nhapdiem">Nhập điểm</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="group05" icon={<BuildOutlined />} title="Thống kê">
                  <Menu.Item key="13">
                    <Link to="/tk_hocvien">Thống kê học viên</Link>
                  </Menu.Item>
                  <Menu.Item key="14">
                    <Link to="/tk_giangvien">Thống kê giảng viên</Link>
                  </Menu.Item>
                  <Menu.Item key="15">
                    <Link to="/tk_lophoc">Thống kê lớp học</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="99" icon={<SettingOutlined />}>
                  <Link to="/testing">Thử nghiệm</Link>
                </Menu.Item>
              </Menu>
            </Sider>

            <Layout style={{ padding: isLoginPage ? '0' : '0 24px 24px' }}>
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  <Route path="/" element={isAuthenticated ? <TrangChu /> : <Navigate to="/login" />} />
                  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/taikhoan" element={isAuthenticated ? <TaiKhoan /> : <Navigate to="/login" />} />
                  <Route path="/nhanvien" element={isAuthenticated ? <NhanVien /> : <Navigate to="/login" />} />
                  <Route path="/hocvien" element={isAuthenticated ? <HocVien /> : <Navigate to="/login" />} />
                  <Route path="/phonghoc" element={isAuthenticated ? <PhongHoc /> : <Navigate to="/login" />} />
                  <Route path="/cahoc" element={isAuthenticated ? <CaHoc /> : <Navigate to="/login" />} />
                  <Route path="/monhoc" element={isAuthenticated ? <MonHoc /> : <Navigate to="/login" />} />
                  <Route path="/lophoc" element={isAuthenticated ? <LopHoc /> : <Navigate to="/login" />} />
                  <Route path="/lichhoc" element={isAuthenticated ? <LichHoc /> : <Navigate to="/login" />} />
                  <Route path="/dangky" element={isAuthenticated ? <LichHoc /> : <Navigate to="/login" />} />
                  <Route path="/ds_thi" element={isAuthenticated ? <LichHoc /> : <Navigate to="/login" />} />
                  <Route path="/nhapdiem" element={isAuthenticated ? <LichHoc /> : <Navigate to="/login" />} />
                  <Route path="/tk_hocvien" element={isAuthenticated ? <TKHocVien /> : <Navigate to="/login" />} />
                  <Route path="/tk_giangvien" element={isAuthenticated ? <TKGiangVien /> : <Navigate to="/login" />} />
                  <Route path="/tk_lophoc" element={isAuthenticated ? <TKLopHoc /> : <Navigate to="/login" />} />
                  <Route path="/testing" element={isAuthenticated ? <HocVienTable /> : <Navigate to="/login" />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </>
      )}

      {isLoginPage && ( // Xử lý riêng cho trang Login
        <Content style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </Content>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;