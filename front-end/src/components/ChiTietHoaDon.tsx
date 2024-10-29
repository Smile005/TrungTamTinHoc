import React, { useEffect, useState } from 'react';
import { Modal, Divider, Typography, message, Spin, Row, Col, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface ChiTietHoaDonProps {
  visible: boolean;
  onCancel: () => void;
  maHoaDon: string;
}

const ChiTietHoaDon: React.FC<ChiTietHoaDonProps> = ({ visible, onCancel, maHoaDon }) => {
  const [hoaDon, setHoaDon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHoaDon = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/hoadon/hoaDonByMa/maHoaDon=${maHoaDon}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHoaDon(response.data);
      } catch (error) {
        message.error('Lỗi khi lấy thông tin hóa đơn');
      } finally {
        setLoading(false);
      }
    };

    if (maHoaDon) {
      fetchHoaDon();
    }
  }, [maHoaDon]);

  const { Title, Text } = Typography;

  const handleExportPDF = () => {
    window.open(`http://localhost:8081/api/hoadon/hoaDonPDF/${maHoaDon}`, '_blank');
  };  

  return (
    <Modal 
      visible={visible} 
      onCancel={onCancel} 
      title="Hóa Đơn Chi Tiết" 
      footer={[
        <Button key="export-pdf" type="primary" onClick={handleExportPDF}>
          Xuất PDF
        </Button>,
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>
      ]}
      width={700}
    >
      {loading ? (
        <Spin tip="Đang tải..." />
      ) : (
        hoaDon && (
          <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <Row justify="space-between" style={{ marginBottom: '20px' }}>
              <Col>
                <Title level={3}>Hóa Đơn: {hoaDon.maHoaDon}</Title>
              </Col>
              <Col>
                <Text>Mã Nhân Viên: {hoaDon.maNhanVien}</Text><br/>
                <Text>Nhân Viên: {hoaDon.tenNhanVien}</Text>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col>
                <Text strong>Mã Học Viên: </Text>
                <Text>{hoaDon.maHocVien} - {hoaDon.tenHocVien}</Text><br/>
                <Text strong>Ngày Sinh: </Text>
                <Text>{moment(hoaDon.ngaySinh).format('DD/MM/YYYY')}</Text><br/>
                <Text strong>Giới Tính: </Text>
                <Text>{hoaDon.gioiTinh}</Text>
              </Col>
              <Col>
                <Text strong>Ngày Tạo Hóa Đơn: </Text>
                <Text>{moment(hoaDon.ngayTaoHoaDon).format('DD/MM/YYYY')}</Text>
              </Col>
            </Row>

            <Divider />

            <Title level={4}>Chi Tiết Các Môn Học</Title>
            <Row>
              <Col span={18}>
                <Text strong>Môn Học</Text>
              </Col>
              <Col span={6}>
                <Text strong>Học Phí</Text>
              </Col>
            </Row>
            {hoaDon.chiTietHoaDon.map((monHoc: any, index: number) => (
              <Row key={index} style={{ marginBottom: '10px' }}>
                <Col span={18}>
                  <Text>{monHoc.tenMonHoc}</Text>
                </Col>
                <Col span={6}>
                  <Text>{monHoc.hocPhi.toLocaleString()} VND</Text>
                </Col>
              </Row>
            ))}

            <Divider />

            <Row justify="center" style={{ marginTop: '20px', textAlign: 'center' }}>
              <Col>
                <Title level={4}>Tổng Số Tiền</Title>
                <Text strong style={{ fontSize: '18px' }}>
                  {hoaDon.chiTietHoaDon.reduce((acc: number, item: any) => acc + item.hocPhi, 0).toLocaleString()} VND
                </Text>
              </Col>
            </Row>
          </div>
        )
      )}
    </Modal>
  );
};

export default ChiTietHoaDon;
