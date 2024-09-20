import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TableCustom.css';

const TrangChu: React.FC = () => {
  return (
    <div className="home-page">
      <div className="banner">
        <img
          src="https://res.cloudinary.com/dhyt592i7/image/upload/v1726754524/n1djjbxekx2zhc52u4yg.png"
          alt="Classroom"
          className="banner-image"
        />
        <div className="overlay">
          <h1>BETTER EDUCATION FOR A BETTER WORLD</h1>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <i className="icon fa fa-users"></i>
          <h2>Quản lý nhân viên</h2>
          {/* Use Link to navigate and trigger sidebar highlighting */}
          <Link to="/nhanvien" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <i className="icon fa fa-graduation-cap"></i>
          <h2>Quản lý học viên</h2>
          <Link to="/hocvien" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <i className="icon fa fa-book"></i>
          <h2>Quản lý đào tạo</h2>
          <Link to="/lophoc" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <i className="icon fa fa-list-alt"></i>
          <h2>Quản lý danh mục</h2>
          <Link to="/phonghoc" className="view-more">VIEW MORE</Link>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;