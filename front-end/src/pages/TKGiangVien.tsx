import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import { Select, Button, message, Card } from 'antd';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RobotoRegular from '../fonts/Roboto-regular';

const { Option } = Select;

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend);

const TKGiangVien: React.FC = () => {
  const [teacherData, setTeacherData] = useState<{ teacher: string; classCount: number }[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const lopHocResponse = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const nhanVienResponse = await axios.get('http://localhost:8081/api/nhanvien/ds-giangvien', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const nhanVienMap = nhanVienResponse.data.reduce((acc: any, nhanVien: any) => {
        acc[nhanVien.maNhanVien] = nhanVien.tenNhanVien;
        return acc;
      }, {});

      const classData = lopHocResponse.data.reduce((acc: any, lopHoc: any) => {
        const teacherId = lopHoc.maNhanVien;
        const teacherName = nhanVienMap[teacherId] || 'Chưa sắp xếp giảng viên';
        if (!acc[teacherName]) {
          acc[teacherName] = 0;
        }
        acc[teacherName] += 1;
        return acc;
      }, {});

      const formattedData = Object.keys(classData).map(teacher => ({
        teacher,
        classCount: classData[teacher],
      }));

      setTeacherData(formattedData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  const barColors = [
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
  ];

  const borderColors = [
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
  ];

  const chartData = {
    labels: teacherData.map((data) => data.teacher),
    datasets: [
      {
        label: 'Số lượng lớp học giảng viên phụ trách',
        data: teacherData.map((data) => data.classCount),
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Thống kê số lượng lớp học giảng viên phụ trách',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const handleChartTypeChange = (value: string) => {
    setChartType(value);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'polar':
        return (
          <div style={{ width: '500px', height: '500px', marginLeft: '280px' }}>
            <PolarArea data={chartData} options={chartOptions} />
          </div>
        );
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  const exportToPDF = async () => {
    if (chartRef.current) {
      const chartContainer = chartRef.current.querySelector('.chart-container');
      if (chartContainer) {
        try {
          const canvas = await html2canvas(chartContainer as HTMLElement);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();

          // Thêm font Roboto hỗ trợ tiếng Việt
          pdf.addFileToVFS('Roboto-Regular.ttf', RobotoRegular);
          pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
          pdf.setFont('Roboto'); // Sử dụng font Roboto

          // Tiêu đề nằm giữa
          const title = 'Thống kê số lớp giảng viên phụ trách';
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const titleWidth = pdf.getTextWidth(title);
          const titleX = (pdfWidth - titleWidth) / 2; // Tính toán vị trí x để căn giữa tiêu đề
          pdf.text(title, titleX, 20); // Vị trí tiêu đề căn giữa

          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          // Lùi hình ảnh xuống 5px
          pdf.addImage(imgData, 'PNG', 0, 25, imgWidth, imgHeight); // Hình ảnh lùi xuống 5px

          // Thêm tiêu đề chi tiết số lượng lớp học
          pdf.setFontSize(14);
          pdf.text('Chi tiết số lượng lớp học giảng viên phụ trách:', 10, imgHeight + 40);

          let yPosition = imgHeight + 50;
          pdf.text('STT', 10, yPosition);
          pdf.text('Tên Giảng Viên', 30, yPosition);
          pdf.text('Số Lượng Lớp', 130, yPosition);

          pdf.setFontSize(12);
          teacherData.forEach((data, index) => {
            yPosition += 10;
            pdf.text((index + 1).toString(), 10, yPosition);
            pdf.text(data.teacher, 30, yPosition);
            pdf.text(data.classCount.toString(), 130, yPosition);
          });

          pdf.save('ThongKeGiangVien.pdf');
        } catch (error) {
          console.error('Lỗi khi xuất PDF:', error);
          message.error('Không thể xuất PDF.');
        }
      } else {
        message.error('Không tìm thấy phần tử biểu đồ để xuất PDF.');
      }
    }
  };

  const totalClasses = teacherData
    .filter((data) => data.teacher !== 'Chưa sắp xếp giảng viên') // Loại bỏ giảng viên chưa sắp xếp
    .reduce((acc, curr) => acc + curr.classCount, 0);
  const maxClassTeacher = teacherData.reduce(
    (prev, curr) => (curr.classCount > prev.classCount ? curr : prev),
    { teacher: 'Không có', classCount: 0 }
  );


  return (
    <div style={{ width: '80%', margin: '0 auto' }} ref={chartRef}>
      <h1 className="page-name">Thống Kê Giảng Viên</h1>
      <div style={{ marginTop: '20px' }}>
        <Select
          defaultValue="bar"
          style={{ width: 120, marginRight: 20 }}
          onChange={handleChartTypeChange}
        >
          <Option value="bar">Bar Chart</Option>
          <Option value="line">Line Chart</Option>
          <Option value="polar">Polar Chart</Option>
        </Select>

        <Button type="primary" onClick={exportToPDF} style={{ left: 848 }}>
          Xuất PDF
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginTop: '20px',
        }}
      >
        {/* Biểu đồ (chart) bên trái */}
        <div
          style={{
            flex: 4, // Tăng kích thước chart
            marginRight: '30px', // Tăng khoảng cách giữa chart và card
          }}
        >
          <div
            className="chart-container"
            style={{
              width: '100%',
              height: '600px', // Tăng chiều cao của biểu đồ
            }}
          >
            {renderChart()}
          </div>
        </div>

        {/* Card bên phải */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card: Tổng số lớp học */}
          <Card
            style={{
              backgroundColor: '#FFCCCC',
              border: '1px solid #FF6666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="Tổng Số Lớp Học"
          >
            <h3>{totalClasses} Lớp Đang Được Giảng Dạy</h3>
          </Card>

          {/* Card: Giảng viên phụ trách nhiều nhất */}
          <Card
            style={{
              backgroundColor: '#CCE5FF',
              border: '1px solid #66B2FF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="Giảng Viên Phụ Trách Nhiều Nhất"
          >
            <h3>
              {maxClassTeacher.teacher} ({maxClassTeacher.classCount} lớp)
            </h3>
          </Card>
        </div>
      </div>

      {/* Card chứa nhận xét */}
      <div style={{ marginTop: '30px' }}>
        <Card
          style={{
            padding: '20px',
            backgroundColor: 'rgb(203, 249, 194)',
            borderRadius: '5px',
            border: '1px solid #28A745',
            bottom: 240,
            height: 190,
          }}
          title="Nhận Xét"
        >
          <p style={{ textAlign: 'justify', fontSize: '16px'}}>
            Tổng số lớp học hiện tại là <strong>{totalClasses}</strong>, được phân bổ giữa{' '}
            <strong>{teacherData.length}</strong> giảng viên. Giảng viên phụ trách nhiều nhất là{' '}
            <strong>{maxClassTeacher.teacher}</strong> với <strong>{maxClassTeacher.classCount}</strong> lớp đang đảm nhiệm.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TKGiangVien;
