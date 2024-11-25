import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Button, message, Dropdown, theme } from 'antd';
import {
  ScheduleOutlined,
  FundOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  UserOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  AuditOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import HocVien from './pages/HocVien';
import NhanVien from './pages/NhanVien';
import LopHoc from './pages/LopHoc';
import TrangChu from './pages/TrangChu';
import MonHoc from './pages/MonHoc';
import LichHoc from './pages/LichHoc';
import Testing from './pages/Testing';
import PhongHoc from './pages/PhongHoc';
import CaHoc from './pages/CaHoc';
import TaiKhoan from './pages/TaiKhoan';
import TKHocVien from './pages/TKHocVien';
import TKCoSo from './pages/TKCoSo';
import TKGiangVien from './pages/TKGiangVien';
import Login from './pages/Login';
import TimKiem from './pages/TimKiem';
import UserInfoModal from './components/UserInforModal';
import DsHocVienLopHoc from './pages/DsHocVienLopHoc';
import DsLop from './pages/DsLop';
import HoaDon from './pages/HoaDon';
import NhapDiem from './pages/NhapDiem';
import DsLopNhapDiem from './pages/DsLopNhapDiem'; 
import DsHocVienThi from './pages/DsHocVienThi';
import DsLopThi from './pages/DsLopThi';
import { NhanVienType } from './types/NhanVienType';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { logout } from './store/slices/authSlice';
import axios from 'axios';
import './App.css';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const [isUserInfoModalVisible, setIsUserInfoModalVisible] = useState(false);
  const [userList, setUserList] = useState<NhanVienType[]>([]);
  const location = useLocation();
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/auth/ds-taikhoan', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserList(response.data);
      } catch (error) {
        // message.error('Lỗi khi lấy danh sách tài khoản');
      }
    };

    if (isAuthenticated) {
      fetchUserList();
    }
  }, [isAuthenticated]);

  const isLoginPage = location.pathname === '/login';


  const handleLogout = () => {
    dispatch(logout());
    message.success(t('logout'));
  };

  const handleUserInfo = () => {
    setIsUserInfoModalVisible(true);
  };

  const getTenNhanVien = (maNhanVien: string) => {
    const user = userList.find(user => user.maNhanVien === maNhanVien);
    return user ? user.tenNhanVien : '';
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    message.success(t('language') + `: ${value === 'vi' ? 'Tiếng Việt' : value === 'en' ? 'English' : '日本語'}`);
  };

  const languageMenu = (
    <Menu onClick={(e) => handleLanguageChange(e.key)}>
      <Menu.Item key="vi">VN_Tiếng Việt</Menu.Item>
      <Menu.Item key="en">EN_English</Menu.Item>
      {/* <Menu.Item key="jp">日本語</Menu.Item> */}
    </Menu>
  );

  return (
    <Layout style={{ height: '104vh' }}>
      {!isLoginPage && (
        <>
          <Header className="custom-header" style={{ background: '#1b7cc2', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <img
                  style={{ width: '50px', height: '50px', borderRadius: '15px' }}
                  src="https://res.cloudinary.com/dhyt592i7/image/upload/v1727773506/kc40wfwdvz41mccxks0w.png"
                  alt="Logo"
                />
                <Link to="/">
                  <h1 style={{ color: 'white', marginLeft: '15px', top: '50px' }}>{t('TTPrometheus')}</h1>
                </Link>
              </div>

              {isAuthenticated && userInfo && (
                <div className='user-info-container'>
                  <Dropdown overlay={languageMenu} trigger={['click']} className='lg-change'>
                    <Button type="link" icon={<GlobalOutlined style={{ fontSize: '25px' }} />} />
                  </Dropdown>
                  <Button type="link" className='user-info' onClick={handleUserInfo}>
                    <p className='user-icon'><UserOutlined /></p>
                    <p className='user-name'>{getTenNhanVien(userInfo.maNhanVien)}</p>
                    <p className='user-name'>{(userInfo.phanQuyen)}</p>
                  </Button>
                  <Button type="link" className='logout-btn' onClick={handleLogout} icon={<LogoutOutlined />} />
                </div>
              )}
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
              <Menu className="custom-menu" mode="inline">
                <Menu.Item key="0" icon={<AppstoreOutlined />}>
                  <Link to="/">{t('home')}</Link>
                </Menu.Item>

                <SubMenu key="group01" icon={<AuditOutlined />} title={t('organization')}>
                  {userInfo?.phanQuyen !== 2 && (
                    <>
                      <Menu.Item key="1">
                        <Link to="/taikhoan">{t('accounts')}</Link>
                      </Menu.Item>
                      <Menu.Item key="2">
                        <Link to="/nhanvien">{t('employees')}</Link>
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Item key="3">
                    <Link to="/hocvien">{t('students')}</Link>
                  </Menu.Item>
                  {userInfo?.phanQuyen !== 2 && (
                    <>
                      <Menu.Item key="4">
                        <Link to="/cahoc">{t('shifts')}</Link>
                      </Menu.Item>
                      <Menu.Item key="5">
                        <Link to="/phonghoc">{t('classrooms')}</Link>
                      </Menu.Item>
                      <Menu.Item key="6">
                        <Link to="/monhoc">{t('subjects')}</Link>
                      </Menu.Item>
                      <Menu.Item key="16">
                        <Link to="/timkiem">{t('search')}</Link>
                      </Menu.Item>
                    </>
                  )}

                </SubMenu>

                {userInfo?.phanQuyen !== 2 && (
                  <SubMenu key="group02" icon={<ScheduleOutlined />} title={t('planning')}>
                    <Menu.Item key="7">
                      <Link to="/lophoc">{t('classes')}</Link>
                    </Menu.Item>
                    {userInfo?.phanQuyen !== 2 && (
                      <Menu.Item key="8">
                        <Link to="/lichhoc">{t('schedule')}</Link>
                      </Menu.Item>
                    )}
                  </SubMenu>
                )}

                <SubMenu key="group03" icon={<SolutionOutlined />} title={t('enrollment')}>

                  <Menu.Item key="10">
                    <Link to="/ds_lop">{t('classList')}</Link>
                  </Menu.Item>

                  <Menu.Item key="15">
                    <Link to="/hoa-don">{t('invoiceDetails')}</Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="group04" icon={<ReadOutlined />} title={t('exam')}>
                  <Menu.Item key="11">
                    <Link to="/ds_lop_thi">{t('examList')}</Link>
                  </Menu.Item>
                  {userInfo?.phanQuyen !== 2 && (
                    <Menu.Item key="12">
                      <Link to="/ds_lop_nhap_diem">{t('enterGrades')}</Link>
                    </Menu.Item>
                  )}
                </SubMenu>


                <SubMenu key="group05" icon={<FundOutlined />} title={t('statistics')}>
                  <Menu.Item key="13">
                    <Link to="/tk_hocvien">{t('studentStatistics')}</Link>
                  </Menu.Item>
                  <Menu.Item key="14">
                    <Link to="/tk_giangvien">{t('teacherStatistics')}</Link>
                  </Menu.Item>
                  <Menu.Item key="17">
                    <Link to="/tk_coso">{t('statusStatistics')}</Link>
                  </Menu.Item>
                </SubMenu>

                <Menu.Item key="99" icon={<SettingOutlined />}>
                  <Link to="/testing">{t('testing')}</Link>
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
                  <Route path="/" element={isAuthenticated ? <TrangChu /> : <Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/taikhoan" element={isAuthenticated ? <TaiKhoan /> : <Navigate to="/login" />} />
                  <Route path="/nhanvien" element={isAuthenticated ? <NhanVien /> : <Navigate to="/login" />} />
                  <Route path="/hocvien" element={isAuthenticated ? <HocVien /> : <Navigate to="/login" />} />
                  <Route path="/phonghoc" element={isAuthenticated ? <PhongHoc /> : <Navigate to="/login" />} />
                  <Route path="/cahoc" element={isAuthenticated ? <CaHoc /> : <Navigate to="/login" />} />
                  <Route path="/monhoc" element={isAuthenticated ? <MonHoc /> : <Navigate to="/login" />} />
                  <Route path="/lophoc" element={isAuthenticated ? <LopHoc /> : <Navigate to="/login" />} />
                  <Route path="/lichhoc" element={isAuthenticated ? <LichHoc /> : <Navigate to="/login" />} />
                  <Route path="/tk_hocvien" element={isAuthenticated ? <TKHocVien /> : <Navigate to="/login" />} />
                  <Route path="/tk_giangvien" element={isAuthenticated ? <TKGiangVien /> : <Navigate to="/login" />} />
                  <Route path="/tk_coso" element={isAuthenticated ? <TKCoSo /> : <Navigate to="/login" />} />
                  <Route path="/testing" element={isAuthenticated ? <Testing /> : <Navigate to="/login" />} />
                  <Route path="/timkiem" element={isAuthenticated ? <TimKiem /> : <Navigate to="/login" />} />
                  <Route path="/ds-hoc-vien-lop/:maLopHoc" element={isAuthenticated ? <DsHocVienLopHoc /> : <Navigate to="/login" />} />
                  <Route path="/ds_lop" element={isAuthenticated ? <DsLop /> : <Navigate to="/login" />} />
                  <Route path="/hoa-don" element={isAuthenticated ? <HoaDon /> : <Navigate to="/login" />} />
                  <Route path="/nhapdiem/:maLopHoc" element={isAuthenticated ? <NhapDiem /> : <Navigate to="/login" />} />
                  <Route path="/ds_lop_nhap_diem" element={isAuthenticated ? <DsLopNhapDiem /> : <Navigate to="/login" />} />
                  <Route path="/ds_thi/:maLopHoc" element={isAuthenticated ? <DsHocVienThi /> : <Navigate to="/login" />} />
                  <Route path="/ds_lop_thi" element={isAuthenticated ? <DsLopThi /> : <Navigate to="/login" />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </>
      )}

      {isLoginPage && (
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Content>
      )}

      <UserInfoModal
        visible={isUserInfoModalVisible}
        onCancel={() => setIsUserInfoModalVisible(false)}
        onLogout={handleLogout}
      />
    </Layout>
  );
};

export default App;
