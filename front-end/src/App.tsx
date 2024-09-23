import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { TeamOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, ReadOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons';
import HocVien from './pages/HocVien';
import NhanVien from './pages/NhanVien';
import LopHoc from './pages/LopHoc';
import TrangChu from './pages/TrangChu';
import MonHoc from './pages/MonHoc';
import LichHoc from './pages/LichHoc';
import HocVienTable from './pages/Testing';
import PhongHoc from './pages/PhongHoc';
import CaHoc from './pages/CaHoc';
import './App.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Function to get the selected menu key based on the current path
  const getSelectedKey = () => {
    if (location.pathname === '/') return '0';  // Home page
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
    return '0';  // Default to home page if no match
  };

  return (
    <Layout>
      <Header className="custom-header">
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
          style={{ background: colorBgContainer }}
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
            selectedKeys={[getSelectedKey()]}  // Dynamically set selected keys
          >
            <Menu.Item key="0" icon={<UserOutlined />}>
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
            <SubMenu key="group02" icon={<TeamOutlined />} title="Lập kế hoạch">
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
                <Link to="/ds_thi">Danh sách thi</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/nhapdiem">Nhập điểm</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="group05" icon={<ReadOutlined />} title="Thống kê">
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
        <Layout style={{ padding: '0 24px 24px' }}>
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
              <Route path="/" element={<TrangChu />} />
              <Route path="/taikhoan" element={<PhongHoc />} />
              <Route path="/nhanvien" element={<NhanVien />} />
              <Route path="/hocvien" element={<HocVien />} />
              <Route path="/phonghoc" element={<PhongHoc />} />
              <Route path="/cahoc" element={<CaHoc />} />
              <Route path="/monhoc" element={<MonHoc />} />
              <Route path="/lophoc" element={<LopHoc />} />
              <Route path="/dangky" element={<LichHoc />} />
              <Route path="/lichhoc" element={<LichHoc />} />
              <Route path="/ds_thi" element={<LichHoc />} />
              <Route path="/nhapdiem" element={<LichHoc />} />
              <Route path="/tk_hocvien" element={<MonHoc />} />
              <Route path="/tk_giangvien" element={<PhongHoc />} />
              <Route path="/tk_lophoc" element={<CaHoc />} />
              <Route path="/testing" element={<HocVienTable />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
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
