import React, { useState } from 'react';
import { Button } from 'antd';
import ThemBuoiHoc from '../components/ThemBuoiHoc';

const Testing = () => {
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };
  return (
    <>
      <Button type="primary" onClick={openModal}>
        Open Steps Modal
      </Button>
      <ThemBuoiHoc
        maLopHoc='LH0001'
        visible={visible}
        onCancel={closeModal}
      />
    </>
  );
};

export default Testing;
