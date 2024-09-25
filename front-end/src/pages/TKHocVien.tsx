import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data for student registrations (can be replaced with API call)
const fetchStudentData = async () => {
    return [
        { month: 'January', students: 30 },
        { month: 'February', students: 25 },
        { month: 'March', students: 45 },
        { month: 'April', students: 60 },
        { month: 'May', students: 35 },
        { month: 'June', students: 40 },
        { month: 'July', students: 50 },
        { month: 'August', students: 55 },
        { month: 'September', students: 30 },
        { month: 'October', students: 70 },
        { month: 'November', students: 65 },
        { month: 'December', students: 75 },
    ];
};

const TKHocVien: React.FC = () => {
    const [studentData, setStudentData] = useState<{ month: string; students: number }[]>([]);

    useEffect(() => {
        // Fetch or load student registration data
        fetchStudentData().then(data => setStudentData(data));
    }, []);

    // Define an array of colors for each bar
    const barColors = [
        'rgba(75, 192, 192, 0.2)', // Light cyan
        'rgba(255, 99, 132, 0.2)', // Light red
        'rgba(54, 162, 235, 0.2)', // Light blue
        'rgba(255, 206, 86, 0.2)', // Light yellow
        'rgba(75, 192, 192, 0.2)', // Light cyan
        'rgba(153, 102, 255, 0.2)', // Light purple
        'rgba(255, 159, 64, 0.2)', // Light orange
        'rgba(255, 99, 132, 0.2)', // Light red
        'rgba(54, 162, 235, 0.2)', // Light blue
        'rgba(255, 206, 86, 0.2)', // Light yellow
        'rgba(75, 192, 192, 0.2)', // Light cyan
        'rgba(153, 102, 255, 0.2)'  // Light purple
    ];

    const borderColors = [
        'rgba(75, 192, 192, 1)', // Cyan
        'rgba(255, 99, 132, 1)', // Red
        'rgba(54, 162, 235, 1)', // Blue
        'rgba(255, 206, 86, 1)', // Yellow
        'rgba(75, 192, 192, 1)', // Cyan
        'rgba(153, 102, 255, 1)', // Purple
        'rgba(255, 159, 64, 1)', // Orange
        'rgba(255, 99, 132, 1)', // Red
        'rgba(54, 162, 235, 1)', // Blue
        'rgba(255, 206, 86, 1)', // Yellow
        'rgba(75, 192, 192, 1)', // Cyan
        'rgba(153, 102, 255, 1)'  // Purple
    ];

    // Prepare data for the bar chart
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
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê số lượng học viên nhập học mỗi tháng',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
        },
    };

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Học Viên</h1>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default TKHocVien;
