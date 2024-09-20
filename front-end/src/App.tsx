import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { TeamOutlined, MenuOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, ReadOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons';
import HocVien from './pages/HocVien';
import NhanVien from './pages/NhanVien';
import LopHoc from './pages/LopHoc';
import TrangChu from './pages/TrangChu';
import MonHoc from './pages/MonHoc';
import LichHoc from './pages/LichHoc';
import HocVienTable from './pages/Testing';
import './App.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Determine which menu item should be selected based on the current route
  const getSelectedKey = () => {
    if (location.pathname.startsWith('/nhanvien')) return '2';
    if (location.pathname.startsWith('/hocvien')) return '3';
    if (location.pathname.startsWith('/lophoc')) return '4';
    if (location.pathname.startsWith('/monhoc')) return '5';
    if (location.pathname.startsWith('/lichhoc')) return '6';
    if (location.pathname.startsWith('/phonghoc')) return '7';
    if (location.pathname.startsWith('/cahoc')) return '8';
    return '1'; // default to 'Trang chủ'
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
          <h1 style={{ color: 'white', marginLeft: '15px' }}>Trung Tâm Prometheus</h1>
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
            defaultSelectedKeys={[getSelectedKey()]} // Use dynamic key based on current route
            selectedKeys={[getSelectedKey()]} // Ensure the key is updated on route change
          >
            <Menu.Item key="1" icon={<MenuOutlined />}>
              <Link to="/">Trang chủ</Link>
            </Menu.Item>
            <SubMenu key="group01" icon={<UserOutlined />} title="Quản lý nhân viên">
              <Menu.Item key="2">
                <Link to="/nhanvien">Nhân viên</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="group02" icon={<TeamOutlined />} title="Quản lý học viên">
              <Menu.Item key="3">
                <Link to="/hocvien">Học viên</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="group03" icon={<SolutionOutlined />} title="Chương trình đào tạo">
              <Menu.Item key="4">
                <Link to="/lophoc">Lớp học</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/monhoc">Môn học</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/lichhoc">Lịch học</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="group04" icon={<ReadOutlined />} title="Quản lý danh mục">
              <Menu.Item key="7">
                <Link to="/phonghoc">Phòng học</Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/cahoc">Ca học</Link>
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
              <Route path="/hocvien" element={<HocVien />} />
              <Route path="/lichhoc" element={<LichHoc />} />
              <Route path="/nhanvien" element={<NhanVien />} />
              <Route path="/lophoc" element={<LopHoc />} />
              <Route path="/monhoc" element={<MonHoc />} />
              <Route path="/testing" element={<HocVienTable />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

// The Router must wrap the AppLayout
const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
