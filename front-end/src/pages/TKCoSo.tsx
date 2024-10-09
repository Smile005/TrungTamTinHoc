import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, PolarArea, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale } from 'chart.js';
import { Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale);

const TKCoSo: React.FC = () => {
    const [data, setData] = useState<{ status: string; count: number }[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>('lopHoc'); 
    const [chartType, setChartType] = useState<string>('doughnut'); // State to manage chart type

    useEffect(() => {
        fetchData(selectedTable);
    }, [selectedTable]);

    const fetchData = async (table: string) => {
        let apiUrl = '';
        switch (table) {
            case 'lopHoc':
                apiUrl = 'http://localhost:8081/api/lophoc/ds-lophoc';
                break;
            case 'hocVien':
                apiUrl = 'http://localhost:8081/api/hocvien/ds-hocvien';
                break;
            case 'phongHoc':
                apiUrl = 'http://localhost:8081/api/phonghoc/ds-phong';
                break;
            case 'caHoc':
                apiUrl = 'http://localhost:8081/api/cahoc';
                break;
            case 'monHoc':
                apiUrl = 'http://localhost:8081/api/monhoc/ds-monhoc';
                break;
            case 'nhanVien':
                apiUrl = 'http://localhost:8081/api/nhanvien/ds-nhanvien';
                break;
            default:
                break;
        }

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = response.data.reduce(
                (acc: any, item: any) => {
                    const status = item.trangThai || item.tinhTrang; 
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                },
                { "ĐANG HOẠT ĐỘNG": 0, "NGƯNG HOẠT ĐỘNG": 0 }
            );

            const formattedData = Object.keys(data).map(status => ({
                status,
                count: data[status],
            }));

            const filteredData = formattedData.filter(item => item.count > 0);
            setData(filteredData);
        } catch (error) {
            message.error(`Lỗi khi lấy dữ liệu từ bảng ${table}`);
        }
    };

    const createChartData = (data: { status: string; count: number }[]) => ({
        labels: data.map((item) => item.status),
        datasets: [
            {
                label: 'Số lượng',
                data: data.map((item) => item.count),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', 
                    'rgba(255, 159, 64, 0.6)', 
                    'rgba(153, 102, 255, 0.6)' 
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', 
                    'rgba(255, 159, 64, 1)', 
                    'rgba(153, 102, 255, 1)' 
                ], 
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Thống kê trạng thái từ bảng ${selectedTable}`,
            },
        },
    };

    const handleChartTypeChange = (value: string) => {
        setChartType(value);
    };

    const renderChart = () => {
        const chartData = createChartData(data);

        const chartStyle = chartType === 'bar' ? { height: '550px', marginLeft: '-220px' } : { height: '500px' };

        switch (chartType) {
            case 'doughnut':
                return <Doughnut data={chartData} options={chartOptions} />;
            case 'pie':
                return <Pie data={chartData} options={chartOptions} />;
            case 'polar':
                return <PolarArea data={chartData} options={chartOptions} />;
            case 'bar':
                return (
                    <div style={{ width: '900px', ...chartStyle }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                );
            default:
                return <Doughnut data={chartData} options={chartOptions} />;
        }
    };

    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <h1 className='page-name'>Thống Kê Trạng Thái</h1>

            <Select
                defaultValue="lopHoc"
                style={{ width: 200, marginBottom: 20 }}
                onChange={setSelectedTable}
            >
                <Option value="lopHoc">Lớp Học</Option>
                <Option value="hocVien">Học Viên</Option>
                <Option value="phongHoc">Phòng Học</Option>
                <Option value="caHoc">Ca Học</Option>
                <Option value="monHoc">Môn Học</Option>
                <Option value="nhanVien">Nhân Viên</Option>
            </Select>

            <Select
                defaultValue="doughnut"
                style={{ width: 200, marginBottom: 20 , marginLeft: "240px"}}
                onChange={handleChartTypeChange}
            >
                <Option value="doughnut">Doughnut Chart</Option>
                <Option value="pie">Pie Chart</Option>
                <Option value="polar">Polar Chart</Option>
                <Option value="bar">Bar Chart</Option>
            </Select>

            <div style={{ width: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                {renderChart()}
            </div>
        </div>
    );
};

export default TKCoSo;
