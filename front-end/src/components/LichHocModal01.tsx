import React from 'react';
import { Modal, Button } from 'antd';

interface EventModalProps {
  visible: boolean;
  onCancel: () => void;
  onEditDate: () => void;
  onEditSchedule: () => void;
  onChangeStatus: () => void;
  onDeleteDate: () => void;
}

const LichHocModal01: React.FC<EventModalProps> = ({
  visible,
  onCancel,
  onEditDate,
  onEditSchedule,
  onChangeStatus,
  onDeleteDate,
}) => {
  return (
    <Modal
      title="Chức năng"
      visible={visible}
      onCancel={onCancel}
      footer={null} // Không hiển thị các nút mặc định ở dưới modal
    >
      <Button onClick={onEditDate} style={{ width: '100%', marginBottom: '8px' }}>
        Chỉnh sửa ngày học
      </Button>
      <Button onClick={onEditSchedule} style={{ width: '100%', marginBottom: '8px' }}>
        Chỉnh sửa lịch học
      </Button>
      <Button onClick={onChangeStatus} style={{ width: '100%', marginBottom: '8px' }}>
        Đổi trạng thái
      </Button>
      <Button danger onClick={onDeleteDate} style={{ width: '100%' }}>
        Xóa ngày học
      </Button>
    </Modal>
  );
};

export default LichHocModal01;
