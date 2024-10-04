import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Select, message } from 'antd';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

// Register the necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TKHocVien: React.FC = () => {
    const [studentData, setStudentData] = useState<{ month: string; students: number }[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear()); // Năm hiện tại

    useEffect(() => {
        fetchStudentData(year);
    }, [year]);

    const fetchStudentData = async (selectedYear: number) => {
        try {
            const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = response.data
                .filter((student: any) => moment(student.ngayVaoHoc).year() === selectedYear) // Lọc theo năm
                .reduce((acc: any, student: any) => {
                    const month = moment(student.ngayVaoHoc).format('MMMM'); // Lấy tháng
                    acc[month] = (acc[month] || 0) + 1; // Tăng số lượng học viên cho tháng đó
                    return acc;
                }, {});

            // Chuyển dữ liệu thành mảng
            const chartData = Object.keys(data).map((month) => ({
                month,
                students: data[month]
            }));

            setStudentData(chartData);
        } catch (error) {

        }
    };

    const handleYearChange = (value: number) => {
        setYear(value);
    };

    // Danh sách màu sắc cho các tháng
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

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Học Viên</h1>
            <Select 
                defaultValue={year} 
                style={{ width: 120, marginBottom: 20 }}
                onChange={handleYearChange}
            >
                {[...Array(5)].map((_, index) => (
                    <Option key={index} value={new Date().getFullYear() - index}>
                        {new Date().getFullYear() - index}
                    </Option>
                ))}
            </Select>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default TKHocVien;
