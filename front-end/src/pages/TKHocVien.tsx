import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import { Select, message, Button } from 'antd';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Option } = Select;

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend);

const TKHocVien: React.FC = () => {
    const [studentData, setStudentData] = useState<{ month: string; students: number }[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear()); 
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [chartType, setChartType] = useState<string>('bar'); 
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStudentData(year); 
        fetchAvailableYears(); 
    }, [year]);

    const fetchStudentData = async (selectedYear: number) => {
        try {
            const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = response.data
                .filter((student: any) => moment(student.ngayVaoHoc).year() === selectedYear) 
                .reduce((acc: any, student: any) => {
                    const month = moment(student.ngayVaoHoc).format('MMMM'); 
                    acc[month] = (acc[month] || 0) + 1; 
                    return acc;
                }, {});

            const chartData = Object.keys(data).map((month) => ({
                month,
                students: data[month]
            }));

            setStudentData(chartData);
        } catch (error) {
            message.error('Lỗi khi lấy dữ liệu học viên');
        }
    };

    const fetchAvailableYears = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
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
                const canvas = await html2canvas(chartElement as HTMLElement);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);

                let yPosition = pdfHeight + 30;
                studentData.forEach((data) => {
                    
                });

                pdf.save(`ThongKeHocVien_${year}.pdf`);
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
