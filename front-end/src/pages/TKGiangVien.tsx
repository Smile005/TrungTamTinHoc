// File: src/pages/TKGiangVien.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data for the number of classes per teacher (replace this with an API call)
const fetchTeacherData = async () => {
    return [
        { teacher: 'Nguyen Van A', classCount: 5 },
        { teacher: 'Tran Thi B', classCount: 8 },
        { teacher: 'Le Van C', classCount: 3 },
        { teacher: 'Pham Thi D', classCount: 10 },
    ];
};

const TKGiangVien: React.FC = () => {
    const [teacherData, setTeacherData] = useState<{ teacher: string; classCount: number }[]>([]);

    useEffect(() => {
        fetchTeacherData().then(data => setTeacherData(data));
    }, []);

    const barColors = [
        'rgba(153, 102, 255, 0.2)', // Light purple
        'rgba(255, 159, 64, 0.2)', // Light orange
        'rgba(255, 99, 132, 0.2)', // Light red
        'rgba(54, 162, 235, 0.2)', // Light blue
        'rgba(255, 206, 86, 0.2)', // Light yellow
        'rgba(75, 192, 192, 0.2)', // Light cyan
        'rgba(153, 102, 255, 0.2)'  // Light purple
    ];

    const borderColors = [
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)', 
        'rgba(255, 99, 132, 1)', 
        'rgba(54, 162, 235, 1)', 
        'rgba(255, 206, 86, 1)', 
        'rgba(75, 192, 192, 1)', 
        'rgba(153, 102, 255, 1)'  
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

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Giảng Viên</h1>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default TKGiangVien;
