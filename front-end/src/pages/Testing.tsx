import React, { useState } from 'react';
import { Button } from 'antd';
import AddLopHoc from '../components/AddLopHoc';

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
      <AddLopHoc
        visible={visible}
        onCancel={closeModal}
      />
    </>
  );
};

export default Testing;
