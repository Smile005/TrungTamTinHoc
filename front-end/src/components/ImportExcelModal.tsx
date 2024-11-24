import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface ImportExcelModalProps {
    visible: boolean;
    onCancel: () => void;
    modalType: 'hocvien' | 'nhanvien' | 'lophoc'; // Thêm loại modal
}

const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ visible, onCancel, modalType }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const excelFilePath = modalType === 'hocvien'
        ? '/excel/hocvien.xlsx'
        : modalType === 'nhanvien'
            ? '/excel/nhanvien.xlsx'
            : '/excel/lophoc.xlsx'; // Thêm đường dẫn cho lớp học

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file as FileType);
        });
        setUploading(true);
        // Gửi yêu cầu upload đến server
        fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success('Upload thành công.');
            })
            .catch(() => {
                message.error('Upload thất bại.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isExcel =
                file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel';

            if (!isExcel) {
                message.error('Bạn chỉ có thể upload file Excel!');
                return Upload.LIST_IGNORE;
            }

            if (fileList.length >= 1) {
                message.error('Chỉ có thể upload 1 file!');
                return Upload.LIST_IGNORE;
            }

            setFileList([file]); // Chỉ giữ 1 file trong danh sách
            return false;
        },
        fileList,
    };

    return (
        <Modal
            title={modalType === 'hocvien' ? 'Nhập Excel Học Viên' : 'Nhập Excel Nhân Viên'}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <div>
                Tải file Excel {modalType === 'hocvien' ? 'Học viên' : 'Nhân viên'} mẫu
                <a href={excelFilePath} download > tại đây</a>
            </div>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Đang upload' : 'Chọn'}
            </Button>
        </Modal>
    );
};

export default ImportExcelModal;
