import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Select, message } from 'antd';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

const { Option } = Select;

const TKCoSo: React.FC = () => {
    const [data, setData] = useState<{ status: string; count: number }[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>('lopHoc'); 
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

    const createDoughnutChartData = (data: { status: string; count: number }[]) => ({
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
                    'rgba(153, 102, 255, 1)' // Màu mới
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

            <div style={{ width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Doughnut data={createDoughnutChartData(data)} options={chartOptions} />
            </div>
        </div>
    );
};

export default TKCoSo;
