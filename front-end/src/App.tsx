import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu, theme} from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import HocVien from './pages/HocVien';
import NhanVien from './pages/NhanVien';
import LopHoc from './pages/LopHoc';
import TrangChu from './pages/TrangChu';
import MonHoc from './pages/MonHoc';
import LichHoc from './pages/LichHoc';
import HocVienTable from './pages/Testing';

import './App.css'

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

const About = () => <div>About Page Content</div>;
const Contact = () => <div>Contact Page Content</div>;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Header className='custom-header'>
          <div className="demo-logo" />
          <p style={{ color: 'white' }}>Đây là header</p>
        </Header>
        <Layout>
          <Sider width={260} style={{ background: colorBgContainer }}>
            <Menu className='custom-menu' mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1"><Link to="/">Trang chủ</Link></Menu.Item>
              <SubMenu key="group01" icon={<TeamOutlined />} title="Chức năng của quản lý">
                <Menu.Item key="2"><Link to="/nhanvien">Nhân viên</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="group02" icon={<TeamOutlined />} title="Chức năng của quản lý">
                <Menu.Item key="3"><Link to="/hocvien">Học viên</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="group03" icon={<TeamOutlined />} title="Chương trình đào tạo">
                <Menu.Item key="4"><Link to="/lophoc">Lớp học</Link></Menu.Item>
                <Menu.Item key="5"><Link to="/monhoc">Môn học</Link></Menu.Item>
                <Menu.Item key="6"><Link to="/lichhoc">Lịch học</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="group04" icon={<TeamOutlined />} title="Quản lý danh mục">
                <Menu.Item key="7"><Link to="/phonghoc">Phòng học</Link></Menu.Item>
                <Menu.Item key="8"><Link to="/cahoc">Ca học</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="99"><Link to="/testing">Thử nghiệm</Link></Menu.Item>
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
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
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
        {/* <Footer style={{ textAlign: 'center', backgroundColor: 'red' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Router>
  );
};

export default App;
