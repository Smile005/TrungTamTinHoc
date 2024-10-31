const pool = require('../config/db');
const moment = require('moment');

// Lấy lịch học theo mã lớp
const getLichHocByMaLop = async (req, res) => {
    const { maLopHoc } = req.params; // Lấy maLopHoc từ tham số URL

    try {
        const query = `SELECT * FROM LichHoc WHERE maLopHoc = ?;`;
        const [result] = await pool.query(query, [maLopHoc]); // Sử dụng pool để truy vấn

        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lịch học cho mã lớp này.' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi trong quá trình lấy dữ liệu lịch học.' });
    }
};

// Tạo mã lịch học mới
const createMaLichHoc = async () => {
    try {
        const query = `SELECT maLichHoc FROM LichHoc ORDER BY maLichHoc DESC LIMIT 1;`;
        const [result] = await pool.query(query);

        let nextMaLichHoc;

        if (result.length > 0) {
            const lastMaLichHoc = result[0].maLichHoc; // Lấy mã lịch học cuối
            const numericPart = parseInt(lastMaLichHoc.slice(3)); // Lấy phần số (sau TKB)
            const newNumericPart = numericPart + 1; // Tăng phần số lên 1
            nextMaLichHoc = `TKB${newNumericPart.toString().padStart(4, '0')}`; // Cập nhật mã mới
        } else {
            nextMaLichHoc = 'TKB0001'; // Mã mặc định
        }

        return nextMaLichHoc;
    } catch (error) {
        console.error("Lỗi trong quá trình tạo mã lịch học:", error.message);
        throw new Error('Không thể tạo mã lịch học'); // Thông báo lỗi
    }
};

// Tạo nhiều buổi học theo mã lịch học
const createBuoiHocByMaLichHoc = async (maLichHoc) => {
    const trangThai = 'Đã lên lịch';
    try {
        // Lấy thông tin lịch học
        const [lichHoc] = await pool.query(`SELECT * FROM LichHoc WHERE maLichHoc = ?`, [maLichHoc]);
        if (!lichHoc.length) {
            return { status: 404, message: "Lịch học không tồn tại" }; // Trả về một đối tượng thay vì res
        }

        const { maLopHoc, thu, maCa, maPhong, soBuoi, maGiaoVien } = lichHoc[0]; // Thêm maGiaoVien vào destructuring

        // Lấy ngayBatDau từ bảng LopHoc thông qua maLopHoc
        const [lopHoc] = await pool.query(`SELECT ngayBatDau FROM LopHoc WHERE maLopHoc = ?`, [maLopHoc]);
        if (!lopHoc.length) {
            return { status: 404, message: "Lớp học không tồn tại" }; // Trả về một đối tượng thay vì res
        }

        const { ngayBatDau } = lopHoc[0];

        // Khởi tạo thời gian bắt đầu và biến đếm số buổi học
        let currentDate = moment(ngayBatDau);
        let createdBuoiHoc = 0;

        // Tạo buổi học cho các ngày theo soBuoi
        while (createdBuoiHoc < soBuoi) {
            // Kiểm tra nếu ngày hiện tại trùng với thứ trong lịch học
            if (currentDate.day() === thu) {  // Trong moment.js chủ nhật là 0, thứ 2 là 1,...
                // Tạo buổi học
                await pool.query(
                    `INSERT INTO BuoiHoc (maLichHoc, maLopHoc, maGiaoVien, maCa, maPhong, ngayHoc, trangThai)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        maLichHoc,
                        maLopHoc,
                        maGiaoVien, // Sử dụng maGiaoVien từ lịch học
                        maCa,
                        maPhong,
                        currentDate.format('YYYY-MM-DD'),
                        trangThai
                    ]
                );
                createdBuoiHoc++;
            }
            // Di chuyển đến ngày tiếp theo
            currentDate.add(1, 'day');
        }

        return { status: 201, message: "Đã tạo buổi học theo lịch" }; // Trả về một đối tượng thay vì res
    } catch (error) {
        return { status: 500, message: error.message }; // Trả về một đối tượng thay vì res
    }
};

// Tạo lịch học mới
const createLichHoc = async (req, res) => {
    const { maLopHoc, thu, maCa, maGiaoVien, maPhong, soBuoi, ghiChu } = req.body;

    try {
        // Kiểm tra sự tồn tại của maLopHoc
        const lopHocQuery = `SELECT * FROM LopHoc WHERE maLopHoc = ?`;
        const [lopHocResult] = await pool.query(lopHocQuery, [maLopHoc]);
        if (lopHocResult.length === 0) {
            return res.status(400).json({ message: 'Mã lớp học không hợp lệ.' });
        }

        // Kiểm tra sự tồn tại của maCa
        const caHocQuery = `SELECT * FROM CaHoc WHERE maCa = ?`;
        const [caHocResult] = await pool.query(caHocQuery, [maCa]);
        if (caHocResult.length === 0) {
            return res.status(400).json({ message: 'Mã ca học không hợp lệ.' });
        }

        // Kiểm tra sự tồn tại của maPhong
        const phongHocQuery = `SELECT * FROM PhongHoc WHERE maPhong = ?`;
        const [phongHocResult] = await pool.query(phongHocQuery, [maPhong]);
        if (phongHocResult.length === 0) {
            return res.status(400).json({ message: 'Mã phòng học không hợp lệ.' });
        }

        // Kiểm tra sự tồn tại của maGiaoVien
        const giaoVienQuery = `SELECT * FROM NhanVien WHERE maNhanVien = ?`;
        const [giaoVienResult] = await pool.query(giaoVienQuery, [maGiaoVien]);
        if (giaoVienResult.length === 0) {
            return res.status(400).json({ message: 'Mã giáo viên không hợp lệ.' });
        }

        // Tạo mã lịch học mới
        const maLichHoc = await createMaLichHoc(); // Gọi hàm tạo mã lịch học
        const query = `INSERT INTO LichHoc (maLichHoc, maLopHoc, thu, maCa, maGiaoVien, maPhong, soBuoi, ghiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        await pool.query(query, [
            maLichHoc,
            maLopHoc,
            thu,
            maCa,
            maGiaoVien,
            maPhong,
            soBuoi,
            ghiChu || null
        ]);
        // Tạo buổi học theo mã lịch học
        const result = await createBuoiHocByMaLichHoc(maLichHoc); // Gọi hàm tạo buổi học

        // Kiểm tra kết quả từ hàm tạo buổi học
        if (result.status !== 201) {
            // Nếu tạo buổi học không thành công, xóa LichHoc
            await pool.query('DELETE FROM LichHoc WHERE maLichHoc = ?', [maLichHoc]);

            return res.status(result.status).json({ message: result.message });
        }

        return res.status(201).json({ message: 'Lịch học đã được tạo thành công!', maLichHoc });


        return res.status(201).json({ message: 'Lịch học đã được tạo thành công!', maLichHoc });
    } catch (error) {
        console.error("Lỗi khi tạo lịch học:", error.message); // In ra thông báo lỗi
        return res.status(500).json({ message: 'Không thể tạo lịch học.' });
    }
};

// Cập nhật thông tin buổi học
const updateBuoiHocTheoMa = async (maLichHoc, maLopHoc, maCa, maPhong, maGiaoVien, ghiChu) => {
    const query = `
            UPDATE BuoiHoc 
            SET maPhong = ?, maGiaoVien = ?, ghiChu = ? 
            WHERE maLichHoc = ? AND maLopHoc = ? AND maCa = ?;
        `;

    try {
        await pool.query(query, [
            maPhong,
            maGiaoVien,
            ghiChu,
            maLichHoc,
            maLopHoc,
            maCa]);
    } catch (error) {
        console.error("Lỗi cập nhật buổi học:", error);
        throw new Error("Không thể cập nhật buổi học.");
    }
};

// Cập nhật thông tin lịch học
const updateLichHoc = async (req, res) => {
    const { maLichHoc } = req.params;
    const { maLopHoc, thu, maCa, maPhong, maGiaoVien, soBuoi, ghiChu } = req.body;

    try {
        const lichHocQuery = `SELECT * FROM LichHoc WHERE maLichHoc = ?`;
        const [lichHocResult] = await pool.query(lichHocQuery, [maLichHoc]);
        if (lichHocResult.length === 0) {
            return res.status(404).json({ message: 'Lịch học không tồn tại.' });
        }

        const query = `
            UPDATE LichHoc 
            SET maLopHoc = ?, thu = ?, maCa = ?, maPhong = ?, maGiaoVien = ?, soBuoi = ?, ghiChu = ? 
            WHERE maLichHoc = ?;
        `;
        await pool.query(query, [
            maLopHoc,
            thu,
            maCa,
            maPhong,
            maGiaoVien,
            soBuoi,
            ghiChu,
            maLichHoc
        ]);

        // Gọi hàm cập nhật buổi học nếu cần
        // await updateBuoiHocTheoMa(maLichHoc, maLopHoc, maCa, maPhong, maGiaoVien, ghiChu);

        return res.status(200).json({ message: 'Lịch học đã được cập nhật thành công!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Không thể cập nhật lịch học.' });
    }
};

// Xóa lịch học
const deleteLichHoc = async (req, res) => {
    const { maLichHoc } = req.params; // Lấy mã lịch học từ tham số URL

    try {
        await pool.query(`DELETE FROM LichHoc WHERE maLichHoc = ?`, [maLichHoc]);
        return res.status(200).json({ message: 'Lịch học đã được xóa thành công!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Không thể xóa lịch học.' });
    }
};

module.exports = { getLichHocByMaLop, createLichHoc, updateLichHoc, deleteLichHoc }; 
