import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import { Select, message, Button } from 'antd';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RobotoRegular from '../fonts/Roboto-regular';

const { Option } = Select;

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend);

const TKHocVien: React.FC = () => {
  const [studentData, setStudentData] = useState<{ month: string; students: number }[]>([]);
  const [totalAmountData, setTotalAmountData] = useState<{ month: string; totalAmount: number }[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [chartType, setChartType] = useState<string>('bar'); 
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData(year); 
    fetchAvailableYears(); 
  }, [year]);

  const fetchData = async (selectedYear: number) => {
    try {
      // Fetch both student and invoice data
      const [studentResponse, invoiceResponse, classResponse, subjectResponse] = await Promise.all([
        axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:8081/api/hoadon/ds-hoadon', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:8081/api/monhoc/ds-monhoc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const studentData = studentResponse.data.filter((student: any) => moment(student.ngayVaoHoc).year() === selectedYear);
      const invoices = invoiceResponse.data;
      const classes = classResponse.data;
      const subjects = subjectResponse.data;

      // Group student data by month
      const studentMonthData = studentData.reduce((acc: any, student: any) => {
        const month = moment(student.ngayVaoHoc).format('MMMM');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Calculate the total amount for each month
      const invoiceMonthData = invoices.reduce((acc: any, invoice: any) => {
        const month = moment(invoice.thoiGianHoatDong).format('MMMM');
        acc[month] = (acc[month] || 0) + invoice.soTien; // Assuming `soTien` is the amount of the invoice
        return acc;
      }, {});

      // Merge student and invoice data
      const chartData = Object.keys(studentMonthData).map((month) => ({
        month,
        students: studentMonthData[month],
        totalAmount: invoiceMonthData[month] || 0,
      }));

      setStudentData(chartData);

      // Get the total amount per month by matching students with classes and subjects
      const totalAmountByMonth = calculateTotalAmountByClassAndSubject(classes, studentData, subjects, invoices);
      setTotalAmountData(totalAmountByMonth);

    } catch (error) {
      message.error('Lỗi khi lấy dữ liệu học viên, hóa đơn, lớp học hoặc môn học');
    }
  };

  const calculateTotalAmountByClassAndSubject = (classes: any[], students: any[], subjects: any[], invoices: any[]) => {
    return classes.map((classItem) => {
      const enrolledStudents = students.filter((student) => student.maLopHoc === classItem.maLopHoc);
      let totalAmount = 0;

      enrolledStudents.forEach((student) => {
        // Assuming you have a method to match the subject fees for a student
        const subjectFees = subjects.filter((subject) => subject.maMonHoc === student.maMonHoc)
          .map((subject) => subject.hocPhi);  // Assuming `hocPhi` is the fee for each subject

        totalAmount += subjectFees.reduce((acc: number, fee: number) => acc + fee, 0);
      });

      return {
        month: moment(classItem.ngayBatDau).format('MMMM'), // Assuming the class start date corresponds to month
        totalAmount,
      };
    });
  };

  const fetchAvailableYears = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const years: number[] = response.data
        .map((student: any) => moment(student.ngayVaoHoc).year())
        .filter((year: number) => !isNaN(year));

      const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
      setAvailableYears(uniqueYears);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách năm');
    }
  };

  const handleYearChange = (value: number) => {
    setYear(value);
  };

  const handleChartTypeChange = (value: string) => {
    setChartType(value);
  };

  const barColors = [
    'rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
    'rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'
  ];

  const borderColors = [
    'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
    'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
  ];

    const chartData = {
        labels: studentData.map((data) => data.month),
        datasets: [
            {
                label: 'Số lượng học viên',
                data: studentData.map((data) => data.students),
                backgroundColor: barColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: {
                display: true,
                text: `Thống kê số lượng học viên nhập học năm ${year}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 10 },
            },
        },
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
            const chartElement = chartRef.current.querySelector('.chart-container');
            if (chartElement) {
                try {
                    const canvas = await html2canvas(chartElement as HTMLElement);
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
    
                    // Add the custom font
                    pdf.addFileToVFS('Roboto-Regular.ttf', RobotoRegular);
                    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
                    pdf.setFont('Roboto', 'normal');
    
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
                    // Add image with adjusted position (15px down)
                    const imageYPosition = 10 + 15; // 15px offset
                    pdf.addImage(imgData, 'PNG', 0, imageYPosition, pdfWidth, pdfHeight);
    
                    // Add the title "Thống kê số lượng học viên nhập học" at the top center of the page
                    const title = 'Thống kê số lượng học viên nhập học';
                    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
                    const titleX = (pdfWidth - titleWidth) / 2;
                    pdf.setFontSize(16);
                    pdf.setTextColor(0, 0, 0); // Black text
                    pdf.text(title, titleX, 20);
    
                    let yPosition = pdfHeight + 30 + 15; // Adjust yPosition based on image height and 15px offset
                    pdf.setFontSize(12);
                    pdf.setTextColor(0, 0, 0); // Black text
                    pdf.text('Tháng', 10, yPosition);
                    pdf.text('Số Lượng Học Viên Nhập Học', 80, yPosition);
                    // pdf.text('Tổng Tiền Đã Đóng', 150, yPosition);
    
                    const monthMap: { [key: string]: string } = {
                        'January': 'Tháng 1',
                        'February': 'Tháng 2',
                        'March': 'Tháng 3',
                        'April': 'Tháng 4',
                        'May': 'Tháng 5',
                        'June': 'Tháng 6',
                        'July': 'Tháng 7',
                        'August': 'Tháng 8',
                        'September': 'Tháng 9',
                        'October': 'Tháng 10',
                        'November': 'Tháng 11',
                        'December': 'Tháng 12'
                    };
    
                    studentData.forEach((data, index) => {
                        yPosition += 10;
                        const monthInVietnamese = monthMap[data.month] || data.month; // Convert month to Vietnamese
                        pdf.text(monthInVietnamese, 10, yPosition);
                        pdf.text(`${data.students} Học Viên`, 80, yPosition); // Added "Học Viên" after the student count
                        // pdf.text(`${data.totalAmount} VND`, 150, yPosition); // Hiển thị số tiền
                    });
    
                    pdf.save(`ThongKeHocVien_${year}.pdf`);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    message.error('Không thể xuất PDF.');
                }
            } else {
                message.error('Không tìm thấy phần tử biểu đồ để xuất PDF.');
            }
        }
    };
 
    return (
        <div style={{ width: '80%', margin: '0 auto' }} ref={chartRef}>
            <h1 className='page-name'>Thống Kê Học Viên</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <Select 
                        defaultValue={year} 
                        style={{ width: 120, marginBottom: 20 }}
                        onChange={handleYearChange}
                    >
                        {availableYears.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue="bar"
                        style={{ width: 120, marginLeft: 20, marginBottom: 20 }}
                        onChange={handleChartTypeChange}
                    >
                        <Option value="bar">Bar Chart</Option>
                        <Option value="line">Line Chart</Option>
                        <Option value="polar">Polar Chart</Option>
                    </Select>
                </div>
                <Button type="primary" style={{ bottom: 10}} onClick={exportToPDF}>
                    Xuất PDF
                </Button>
            </div>
            <div className="chart-container">
                {renderChart()}
            </div>
        </div>
    );
};

export default TKHocVien;
