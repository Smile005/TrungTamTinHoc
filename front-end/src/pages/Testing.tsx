import React, { useState } from 'react';
import { Button } from 'antd';
import AddLopHoc from '../components/AddLopHoc'; 

const Testing: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Mở Modal
      </Button>

      <AddLopHoc isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </>
  );
};

export default Testing;
