import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TableCustom.css';

const TrangChu: React.FC = () => {
  return (
    <div className="home-page">
      <div className="banner">
        <img
          src="https://res.cloudinary.com/dhyt592i7/image/upload/v1726848535/nu3r9lpbg5geavgamic1.png"
          alt="Classroom"
          className="banner-image"
        />
        <div className="overlay">
          <h1>BETTER EDUCATION FOR A BETTER WORLD</h1>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <h2>Quản lý nhân viên</h2>
          <Link to="/nhanvien" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <h2>Quản lý học viên</h2>
          <Link to="/hocvien" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <h2>Quản lý đào tạo</h2>
          <Link to="/lophoc" className="view-more">VIEW MORE</Link>
        </div>
        <div className="feature">
          <h2>Quản lý danh mục</h2>
          <Link to="/phonghoc" className="view-more">VIEW MORE</Link>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;