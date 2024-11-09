import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Input, Button, Form, Modal, Steps, message, theme, Table, InputNumber } from 'antd';
import axios from 'axios';
import type { MonHocType } from '../types/MonHocType';
import type { NhanVienType } from '../types/NhanVienType';
import type { LopHocType } from '../types/LopHocType';

const { Option } = Select;

interface AddLopHocProps {
    visible: boolean;
    onCancel: () => void;
}

const AddLopHoc: React.FC<AddLopHocProps> = ({ visible, onCancel }) => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState<number>(0);
    const [createdMaLopHoc, setCreatedMaLopHoc] = useState<string | null>(null);

    const steps = [
        {
            title: 'Bước 1: Tạo lớp học',
            content: <LopHocForm onLopHocCreated={setCreatedMaLopHoc} />,
        },
        {
            title: 'Bước 2: Tạo lịch học',
            content: <LichHocForm maLopHoc={createdMaLopHoc || ''} />,
        },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);
    const resetForm = () => {
        setCreatedMaLopHoc(null);
    };

    const handleCancel = () => {
        resetForm();
        setCurrent(0);
        onCancel();
    };

    return (
        <Modal
            title="Tạo lớp học"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={current === 0 ? 500 : 1000} // Đặt chiều rộng 500px ở bước 1, trở lại 1000px ở bước 2
            style={{ maxWidth: '100%', margin: '0 auto', top: 50 }}
        >
            <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} />
            <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed #e6e6e6', borderRadius: '8px' }}>
                {steps[current].content}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                {current > 0 && <Button style={{ marginRight: 8 }} onClick={prev}>Quay lại</Button>}
                {current < steps.length - 1 && <Button type="primary" onClick={next}>Tiếp theo</Button>}
                {current === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => {
                            message.success('Hoàn thành!');
                            resetForm();
                            setCurrent(0);
                            onCancel();
                        }}
                    >
                        Hoàn tất
                    </Button>
                )}
            </div>
        </Modal>
    );
};

interface LopHocFormProps {
    onLopHocCreated: (maLopHoc: string) => void;
}

const LopHocForm: React.FC<LopHocFormProps> = ({ onLopHocCreated }) => {
    const [monHocs, setMonHocs] = useState<MonHocType[]>([]);
    const [giangViens, setGiangViens] = useState<NhanVienType[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [giangVienResponse, monHocResponse] = await Promise.all([
                    axios.get('http://localhost:8081/api/nhanvien/ds-giangvien', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8081/api/monhoc/ds-monhocHD', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setGiangViens(giangVienResponse.data);
                setMonHocs(monHocResponse.data);
            } catch (error) {
                message.error('Có lỗi xảy ra khi tải dữ liệu.');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (values: any) => {
        const data = {
            lopHocs: [
                {
                    maMonHoc: values.maMonHoc,
                    maNhanVien: values.maNhanVien,
                    ngayBatDau: values.ngayBatDau.format('YYYY-MM-DD'),
                    soLuongMax: values.soLuongMax || 30,
                    ghiChu: values.ghiChu || '',
                },
            ],
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8081/api/lophoc/them-lophoc', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const createdMaLopHoc = response.data.ds_LopHoc[0];
            onLopHocCreated(createdMaLopHoc);
            message.success('Lớp học đã được tạo thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo lớp học.');
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ maxWidth: '100%' }}>
            <Form.Item label="Mã môn học" name="maMonHoc" rules={[{ required: true, message: 'Vui lòng chọn mã môn học!' }]}>
                <Select placeholder="Chọn mã môn học" style={{ width: 400 }}>
                    {monHocs.map(monHoc => (
                        <Option key={monHoc.maMonHoc} value={monHoc.maMonHoc}>
                            {monHoc.maMonHoc} - {monHoc.tenMonHoc}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Giáo viên" name="maNhanVien" rules={[{ required: true, message: 'Vui lòng chọn giáo viên!' }]}>
                <Select placeholder="Chọn giáo viên" style={{ width: 400 }}>
                    {giangViens.map(giangVien => (
                        <Option key={giangVien.maNhanVien} value={giangVien.maNhanVien}>
                            {giangVien.maNhanVien} - {giangVien.tenNhanVien}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="ngayBatDau" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                <DatePicker style={{ width: 400 }} />
            </Form.Item>
            <Form.Item label="Số lượng tối đa" name="soLuongMax" initialValue={30}>
                <InputNumber min={1} style={{ width: 400 }} />
            </Form.Item>
            <Form.Item label="Ghi chú" name="ghiChu">
                <Input.TextArea style={{ width: 400 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: 400 }}>Tạo lớp học</Button>
            </Form.Item>
        </Form>
    );
};

interface LichHocFormProps {
    maLopHoc: string;
}

const LichHocForm: React.FC<LichHocFormProps> = ({ maLopHoc }) => {
    const [lopHoc, setLopHoc] = useState<LopHocType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [buoiHocs, setBuoiHocs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLopHoc = async () => {
            if (!maLopHoc) return;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8081/api/lophoc/lophocByMa/${maLopHoc}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                setLopHoc(response.data);
                setBuoiHocs(response.data.buoiHocs || []);
            } catch (err) {
                setError('Không thể tải thông tin lớp học');
            } finally {
                setLoading(false);
            }
        };

        fetchLopHoc();
    }, [maLopHoc]);

    if (!maLopHoc) return <div>Vui lòng cung cấp mã lớp học hợp lệ.</div>;
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!lopHoc) return <div>Không tìm thấy lớp học</div>;

    const columns = [
        { title: 'Thứ', dataIndex: 'thu', key: 'thu' },
        { title: 'Ca học', dataIndex: 'caHoc', key: 'caHoc' },
        { title: 'Phòng học', dataIndex: 'phongHoc', key: 'phongHoc' },
        { title: 'Giáo viên', dataIndex: 'tenGiangVien', key: 'tenGiangVien' },
        { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
    ];

    return (
        <>
            <h3>Thông tin lớp học</h3>
            <p><strong>Tên lớp học:</strong> {lopHoc.tenLopHoc}</p>
            <p><strong>Môn học:</strong> {lopHoc.tenMonHoc}</p>
            <p><strong>Giáo viên:</strong> {lopHoc.tenNhanVien}</p>

            <h4>Danh sách lịch học</h4>
            <Table columns={columns} dataSource={buoiHocs} rowKey="id" pagination={false} />
        </>
    );
};

export default AddLopHoc;
