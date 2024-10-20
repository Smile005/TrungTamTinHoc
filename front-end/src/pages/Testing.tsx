import React, { useState } from 'react';
import { Button } from 'antd';
import AddLopHoc from '../components/AddLopHoc';

const Testing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle trạng thái hiển thị
  };

  const handleCancel = () => {
    setIsVisible(false); // Ẩn modal khi cancel
  };

  return (
    <>
      <Button type="primary" onClick={toggleVisibility}>
        {isVisible ? 'Đóng' : 'Mở'} AddLopHoc
      </Button>

      <AddLopHoc visible={isVisible} onCancel={handleCancel} />
      {/* Truyền visible và onCancel vào AddLopHoc */}
    </>
  );
}

export default Testing;
