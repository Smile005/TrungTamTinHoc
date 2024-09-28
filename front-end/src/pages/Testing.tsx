import React, { useState } from 'react';
import { Calendar, Button } from 'antd';
import type { Dayjs } from 'dayjs';

const LichHoc: React.FC = () => {
  const handleButtonClick = (date: Dayjs) => {
    console.log(`Button clicked for date: ${date.format('DD-MM-YYYY')}`);
    // Thực hiện hành động khác tại đây
  };

  const dateCellRender = (value: Dayjs) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span>{value.date()}</span> {/* Hiển thị ngày */}
        <Button 
          style={{ marginTop: '5px' }} 
          onClick={() => handleButtonClick(value)}
        >
          Thêm
        </Button>
      </div>
    );
  };

  return (
    <>
      <h1 className='page-name'>QUẢN LÝ LỊCH HỌC</h1>
      <Calendar dateCellRender={dateCellRender} />
    </>
  );
};

export default LichHoc;
