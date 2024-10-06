import React, { useEffect, useState } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import { Select } from 'antd';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

const { Option } = Select;

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, RadialLinearScale, Title, Tooltip, Legend);

const TKGiangVien: React.FC = () => {
    const [teacherData, setTeacherData] = useState<{ teacher: string; classCount: number }[]>([]);
    const [chartType, setChartType] = useState<string>('bar'); 

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

            const nhanVienResponse = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
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
                const teacherName = nhanVienMap[teacherId] || 'Giảng viên không xác định';
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

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Giảng Viên</h1>

            <Select
                defaultValue="bar"
                style={{ width: 120, marginBottom: 20 }}
                onChange={handleChartTypeChange}
            >
                <Option value="bar">Bar Chart</Option>
                <Option value="line">Line Chart</Option>
                <Option value="polar">Polar Chart</Option>
            </Select>

            {renderChart()}
        </div>
    );
};

export default TKGiangVien;
