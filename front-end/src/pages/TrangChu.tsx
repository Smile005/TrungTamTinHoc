import React from 'react';
import '../styles/TableCustom.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="banner">
        <img src="https://res.cloudinary.com/dhyt592i7/image/upload/v1726754524/n1djjbxekx2zhc52u4yg.png" alt="Classroom" className="banner-image" />
        <div className="overlay">
          <h1>BETTER EDUCATION FOR A BETTER WORLD</h1>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <i className="icon fa fa-users"></i>
          <h2>Quản lý nhân viên</h2>
          <a href="/nhanvien" className="view-more">VIEW MORE</a>
        </div>
        <div className="feature">
          <i className="icon fa fa-graduation-cap"></i>
          <h2>Quản lý học viên</h2>
          <a href="/hocvien" className="view-more">VIEW MORE</a>
        </div>
        <div className="feature">
          <i className="icon fa fa-book"></i>
          <h2>Quản lý đào tạo</h2>
          <a href="/lophoc" className="view-more">VIEW MORE</a>
        </div>
        <div className="feature">
          <i className="icon fa fa-list-alt"></i>
          <h2>Quản lý danh mục</h2>
          <a href="/phonghoc" className="view-more">VIEW MORE</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
