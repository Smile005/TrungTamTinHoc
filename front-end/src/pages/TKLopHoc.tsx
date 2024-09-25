
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

// Chỗ này có thể thay bằng API
const fetchClassData = async () => {
    return [
        { status: 'ĐANG HOẠT ĐỘNG', count: 15 },
        { status: 'CÒN TRỐNG', count: 8 },
    ];
};

const TKLopHoc: React.FC = () => {
    const [classData, setClassData] = useState<{ status: string; count: number }[]>([]);

    useEffect(() => {
        // Fetch or load class status data
        fetchClassData().then(data => setClassData(data));
    }, []);

    const chartData = {
        labels: classData.map((data) => data.status),
        datasets: [
            {
                label: 'Số lượng lớp học',
                data: classData.map((data) => data.count),
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'], 
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'], 
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
                text: 'Thống kê trạng thái lớp học',
            },
        },
    };

    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Lớp Học</h1>
            <div style={{ width: '500px', height: '500px', marginLeft: '50px'}}> 
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default TKLopHoc;
