import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Ngăn không cho upload tự động bằng cách trả về false trong beforeUpload
  const beforeUpload = (file: FileType) => {
    return false; // Ngăn không upload tự động khi chọn file
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Giới hạn chỉ 1 ảnh
  };

  // Hàm để upload file khi người dùng nhấn "Xác nhận"
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn ít nhất một ảnh!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file.originFileObj as FileType);
    });

    try {
      // Thực hiện upload ảnh (sử dụng Mock API hoặc API thực tế)
      const response = await fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Upload thành công!');
        setFileList([]); // Xóa danh sách sau khi upload thành công
      } else {
        message.error('Upload thất bại!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Upload thất bại!');
    } finally {
      setIsUploading(false);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div>
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={beforeUpload} // Ngăn upload tự động
        >
          {fileList.length < 1 && '+ Upload'}
        </Upload>
      </ImgCrop>
      
      {/* Nút "Xác nhận" để upload thủ công */}
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0 || isUploading}
        loading={isUploading}
      >
        {isUploading ? 'Đang tải lên...' : 'Xác nhận'}
      </Button>
    </div>
  );
};

export default App;
