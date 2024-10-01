import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface SuaNhanVienModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: any) => void;
    initialValues: any;
}

const SuaNhanVienModal: React.FC<SuaNhanVienModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    // Khi modal được mở, điền dữ liệu ban đầu vào form
    React.useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                ngaySinh: initialValues.ngaySinh ? moment(initialValues.ngaySinh, 'YYYY-MM-DD') : null, // Format ngày để hiển thị trong DatePicker
            });
        }
    }, [initialValues]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Kiểm tra và format ngày sinh chỉ khi giá trị không null
                const formattedValues = {
                    maNhanVien: values.maNhanVien,
                    tenNhanVien: values.tenNhanVien,
                    gioiTinh: values.gioiTinh,
                    ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null, // Format ngày sinh thành chuỗi yyyy-mm-dd
                    trangThai: values.trangThai
                };

                // Gọi API để sửa nhân viên
                axios.post('http://localhost:8081/api/nhanvien/sua-nhanvien', formattedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
                    }
                })
                .then(() => {
                    message.success('Sửa thông tin nhân viên thành công');
                    onOk(formattedValues); // Gọi callback để cập nhật lại bảng dữ liệu
                    form.resetFields(); // Reset lại form sau khi submit thành công
                })
                .catch((error) => {
                    message.error('Lỗi khi sửa thông tin nhân viên: ' + error.message);
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Sửa Nhân Viên"
            visible={visible}
            onCancel={() => {
                form.resetFields(); 
                onCancel(); 
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maNhanVien"
                    label="Mã Nhân Viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="tenNhanVien"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="gioiTinh"
                    label="Giới Tính"
                >
                    <Radio.Group>
                        <Radio value="Nam">Nam</Radio>
                        <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="ngaySinh"
                    label="Ngày Sinh"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Tình Trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                >
                    <Select>
                        <Select.Option value="Full time">Full time</Select.Option>
                        <Select.Option value="Part time">Part time</Select.Option>
                        <Select.Option value="Thực tập sinh">Thực tập sinh</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SuaNhanVienModal;
