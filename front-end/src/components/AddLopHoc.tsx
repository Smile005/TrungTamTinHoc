import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message, Row, Col, Steps, theme } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface AddLopHocProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

const AddLopHoc: React.FC<AddLopHocProps> = ({ isModalVisible, setIsModalVisible }) => {
    const { token } = theme.useToken();
    const [formLopHoc] = Form.useForm();
    const [monHocList, setMonHocList] = useState<{ maMonHoc: string, tenMonHoc: string }[]>([]);
    const [nhanVienList, setNhanVienList] = useState<{ maNhanVien: string, tenNhanVien: string }[]>([]);
    const [caHocList, setCaHocList] = useState<{ maCaHoc: string, batDau: string, ketThuc: string }[]>([]);
    const [phongHocList, setPhongHocList] = useState<{ maPhong: string, soLuong: number }[]>([]);

    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Tạo Lớp Học',
            content: renderHocVienForm(formLopHoc, monHocList, nhanVienList),
        },
        {
            title: 'Thêm Lịch Học',
            content: renderLichHocForm(formLopHoc, caHocList, phongHocList, monHocList, nhanVienList),
            description: 'Có thể bỏ qua',
        },
        {
            title: 'Thêm Học Viên',
            content: 'Có thể bỏ qua',
            description: 'Có thể bỏ qua',
        },
    ];

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/monhoc/ds-monhoc', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setMonHocList(response.data);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách môn học: ' + error.message);
            });

        axios
            .get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const giangVienData = response.data.filter((nhanVien: any) => nhanVien.chucVu === 'Giảng Viên');
                setNhanVienList(giangVienData);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách giảng viên: ' + error.message);
            });

        axios
            .get('http://localhost:8081/api/cahoc', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setCaHocList(response.data);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách ca học: ' + error.message);
            });

        axios
            .get('http://localhost:8081/api/phonghoc/ds-phong', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setPhongHocList(response.data);
            })
            .catch((error) => {
                message.error('Lỗi khi lấy danh sách phòng học: ' + error.message);
            });
    }, []);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleOk = () => {
        message.success('Processing complete!');
        setIsModalVisible(false);
        setCurrent(0); // Reset bước về 0 khi đóng modal
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrent(0); // Reset bước về 0 khi đóng modal
    };

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    return (
        <Modal
            title="Quá Trình Tạo Lớp Học"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <div>
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={handleOk}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={prev}>
                            Previous
                        </Button>
                    )}
                </div>
                <div>
                    <Button type="primary" onClick={() => setCurrent(0)}>
                        Reset
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddLopHoc;

const renderHocVienForm = (
    form: any,
    monHocList: { maMonHoc: string, tenMonHoc: string }[],
    nhanVienList: { maNhanVien: string, tenNhanVien: string }[]
) => (
    <Form form={form} layout="vertical">
        <Form.Item
            name="maMonHoc"
            label="Môn Học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
        >
            <Select placeholder="Chọn Môn Học">
                {monHocList.map((monHoc) => (
                    <Select.Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                        {monHoc.maMonHoc} - {monHoc.tenMonHoc}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item
            name="maNhanVien"
            label="Giảng Viên"
            rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
            <Select placeholder="Chọn Giảng Viên">
                {nhanVienList.map((nhanVien) => (
                    <Select.Option key={nhanVien.maNhanVien} value={nhanVien.maNhanVien}>
                        {nhanVien.maNhanVien} - {nhanVien.tenNhanVien}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="ngayBatDau"
                    label="Ngày Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="soLuong"
                    label="Số Lượng"
                    initialValue={30}
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item
            name="trangThai"
            label="Tình Trạng"
            rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
        >
            <Select defaultValue="Chưa mở đăng ký">
                <Select.Option value="Có thể đăng ký">Có thể đăng ký</Select.Option>
                <Select.Option value="Chưa mở đăng ký">Chưa mở đăng ký</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi Chú">
            <Input.TextArea rows={4} />
        </Form.Item>
    </Form>
);

const renderLichHocForm = (
    formLopHoc: any,
    caHocList: { maCaHoc: string, batDau: string, ketThuc: string }[],
    phongHocList: { maPhong: string, soLuong: number }[],
    monHocList: { maMonHoc: string, tenMonHoc: string }[],
    nhanVienList: { maNhanVien: string, tenNhanVien: string }[]
) => {
    const maMonHoc = formLopHoc.getFieldValue('maMonHoc');
    const selectedMonHoc = monHocList.find((mh) => mh.maMonHoc === maMonHoc);
    const tenMonHoc = selectedMonHoc ? selectedMonHoc.tenMonHoc : 'Chưa chọn môn học';

    const maNhanVien = formLopHoc.getFieldValue('maNhanVien');
    const selectedNhanVien = nhanVienList.find((nv) => nv.maNhanVien === maNhanVien);
    const tenNhanVien = selectedNhanVien ? selectedNhanVien.tenNhanVien : 'Chưa chọn môn học';

    const soBuoi = formLopHoc.getFieldValue('soLuong');
    const ngayBatDau = formLopHoc.getFieldValue('ngayBatDau')

    return (
        <div>
            <div >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <p>Tên môn học: {maMonHoc ? `${tenMonHoc}` : 'Chưa chọn môn học'}</p>
                    <p>Tên giảng viên: {maNhanVien ? `${tenNhanVien}` : 'Chưa chọn giảng viên'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <p>Số buổi học thực tế: 0</p>
                    <p>Tổng số buổi học: {soBuoi || 'Chưa nhập số buổi'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <p>Ngày bắt đầu: {ngayBatDau ? moment(ngayBatDau).format('DD/MM/YYYY') : 'Chưa chọn ngày bắt đầu'}</p>
                    <p>Tổng số buổi học: {soBuoi || 'Chưa nhập số buổi'}</p>
                </div>
            </div>
            <div>

            </div>
        </div>
    );
};
