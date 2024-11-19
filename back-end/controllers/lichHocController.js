const pool = require('../config/db');
const moment = require('moment');

// Hàm tính toán các buổi học
const calculateLichHoc = (ngayBatDau, thu, soBuoi) => {
    let currentDate = moment(ngayBatDau);  // Khởi tạo ngày bắt đầu
    let daysOfWeek = [];
    let createdBuoiHoc = 0;

    // Tính các ngày học từ ngayBatDau dựa trên thu (Ngày trong tuần)
    while (createdBuoiHoc < soBuoi) {
        // Tìm ngày có thu tương ứng (Thứ 'thu' trong tuần)
        if (currentDate.day() === thu) {
            daysOfWeek.push(currentDate.format('YYYY-MM-DD'));  // Lưu ngày học vào mảng
            createdBuoiHoc++;
        }
        // Chuyển đến ngày tiếp theo
        currentDate.add(1, 'day');
    }

    return daysOfWeek;  // Trả về danh sách các ngày học
};

// Hàm kiểm tra buổi học trùng maCa và maPhong
const checkTrungLichHoc = async (maCa, maPhong, ngayHoc) => {
    try {
        // Tạo câu truy vấn MySQL để kiểm tra sự trùng lặp trong BuoiHoc
        const query = `
        SELECT * FROM BuoiHoc 
        WHERE maCa = ? AND maPhong = ? AND ngayHoc = ?;
      `;
        const [rows] = await db.execute(query, [maCa, maPhong, ngayHoc]); // db.execute cần có kết nối cơ sở dữ liệu

        // Nếu có kết quả, trả về thông báo trùng lặp
        if (rows.length > 0) {
            return { trungLich: true, message: 'Có buổi học trùng lịch' };
        } else {
            return { trungLich: false, message: 'Không có buổi học trùng lịch' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi kiểm tra lịch học');
    }
};

// Hàm kiểm tra sự trùng lặp của giáo viên (maGiaoVien) trong maCa và ngayHoc
const checkTrungGiaoVien = async (maCa, maGiaoVien, ngayHoc) => {
    try {
        // Tạo câu truy vấn MySQL để kiểm tra sự trùng lặp trong BuoiHoc
        const query = `
        SELECT * FROM BuoiHoc 
        WHERE maCa = ? AND maGiaoVien = ? AND ngayHoc = ?;
      `;
        const [rows] = await db.execute(query, [maCa, maGiaoVien, ngayHoc]); // db.execute cần có kết nối cơ sở dữ liệu

        // Nếu có kết quả, trả về thông báo trùng lịch
        if (rows.length > 0) {
            return { trungLich: true, message: 'Giáo viên này đã có lịch trong ca học và ngày này' };
        } else {
            return { trungLich: false, message: 'Giáo viên không trùng lịch' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi kiểm tra lịch học');
    }
};

// Hàm kiểm tra lịch học
const kiemTraLichHoc = async (req, res) => {
    const { maCa, maPhong, soBuoi, thu, maGiaoVien, maLopHoc } = req.query;
    try {
        // 1. Lấy thông tin lớp học từ cơ sở dữ liệu
        const query = 'SELECT ngayBatDau FROM LopHoc WHERE maLopHoc = ?';

        // Sử dụng pool.promise().execute() để thực hiện truy vấn với await
        const [results] = await pool.execute(query, [maLopHoc]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Lớp học không tồn tại' });
        }

        const { ngayBatDau } = results[0];

        // 2. Kiểm tra các buổi học cụ thể
        const buoiHoc = calculateLichHoc(ngayBatDau, thu, soBuoi);
        console.log(buoiHoc);

        // 3. Kiểm tra phòng học có trống không
        for (const ngayHoc of buoiHoc) {
            const resultBuoiHoc = await checkTrungLichHoc(maCa, maPhong, ngayHoc);
            console.log(resultBuoiHoc.message);

            if (resultBuoiHoc.trungLich) {
                return res.status(400).json({ message: resultBuoiHoc.message });
            }
        }

        // 4. Kiểm tra giáo viên có trùng lịch dạy không
        for (const ngayHoc of buoiHoc) {
            const resultGiaoVien = await checkTrungGiaoVien(maCa, maGiaoVien, ngayHoc);
            console.log(resultGiaoVien.message);

            if (resultGiaoVien.trungLich) {
                return res.status(400).json({ message: resultGiaoVien.message });
            }
        }

        // Nếu không có sự trùng lặp, trả về thông báo hợp lệ
        return res.status(200).json({ message: 'Lịch học hợp lệ' });

    } catch (error) {
        console.error("Lỗi kiểm tra lịch học:", error.message);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Lấy lịch học theo mã lớp
const getLichHocByMaLop = async (req, res) => {
    const { maLopHoc } = req.params; // Lấy maLopHoc từ tham số URL

    try {
        const query = `SELECT lh.*, nv.tenNhanVien AS tenGiaoVien
        FROM LichHoc lh
        JOIN NhanVien nv ON lh.maGiaoVien = nv.maNhanVien
        WHERE lh.maLopHoc = ?;
        `;
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
                    `INSERT INTO BuoiHoc (maLichHoc, maLopHoc, maGiaoVien, maCa, maPhong, ngayHoc, loai, trangThai)
                     VALUES (?, ?, ?, ?, ?, ?, 'Ngày học', ?)`,
                    [
                        maLichHoc,
                        maLopHoc,
                        maGiaoVien,
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

const checkExistence = async (query, params, errorMessage) => {
    const [result] = await pool.query(query, params);
    if (result.length === 0) {
        throw new Error(errorMessage);
    }
};

const createLichHoc = async (req, res) => {
    const { maLopHoc, thu, maCa, maGiaoVien, maPhong, soBuoi, ghiChu } = req.body;

    try {
        // Kiểm tra sự tồn tại của maLopHoc, maCa, maPhong, maGiaoVien
        await checkExistence('SELECT * FROM LopHoc WHERE maLopHoc = ?', [maLopHoc], 'Mã lớp học không hợp lệ.');
        await checkExistence('SELECT * FROM CaHoc WHERE maCa = ?', [maCa], 'Mã ca học không hợp lệ.');
        await checkExistence('SELECT * FROM PhongHoc WHERE maPhong = ?', [maPhong], 'Mã phòng học không hợp lệ.');
        await checkExistence('SELECT * FROM NhanVien WHERE maNhanVien = ?', [maGiaoVien], 'Mã giáo viên không hợp lệ.');

        // Tạo mã lịch học mới
        const maLichHoc = await createMaLichHoc(); // Gọi hàm tạo mã lịch học
        const query = `
            INSERT INTO LichHoc (maLichHoc, maLopHoc, thu, maCa, maGiaoVien, maPhong, soBuoi, ghiChu)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
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

        // Gọi hàm tạo buổi học dựa trên mã lịch học vừa tạo
        const buoiHocResult = await createBuoiHocByMaLichHoc(maLichHoc);
        if (buoiHocResult.status !== 201) {
            throw new Error(buoiHocResult.message || 'Không thể tạo buổi học.');
        }

        // Lấy thông tin lịch học sau khi tạo
        const lichHocQuery = `
            SELECT LichHoc.*, LopHoc.tenLopHoc, CaHoc.maCa, NhanVien.tenNhanVien AS tenGiaoVien, PhongHoc.maPhong
            FROM LichHoc
            JOIN LopHoc ON LichHoc.maLopHoc = LopHoc.maLopHoc
            JOIN CaHoc ON LichHoc.maCa = CaHoc.maCa
            JOIN NhanVien ON LichHoc.maGiaoVien = NhanVien.maNhanVien
            JOIN PhongHoc ON LichHoc.maPhong = PhongHoc.maPhong
            WHERE LichHoc.maLichHoc = ?
        `;
        const [lichHocResult] = await pool.query(lichHocQuery, [maLichHoc]);

        if (lichHocResult.length > 0) {
            return res.status(201).json({
                message: 'Lịch học đã được tạo thành công!',
                lichHoc: lichHocResult[0], // Trả về thông tin lịch học
                buoiHocMessage: buoiHocResult.message // Trả về thông báo của buổi học
            });
        } else {
            throw new Error('Không thể lấy thông tin lịch học vừa tạo.');
        }
    } catch (error) {
        console.error("Lỗi khi tạo lịch học:", error.message); // In ra thông báo lỗi
        return res.status(500).json({ message: error.message || 'Không thể tạo lịch học.' });
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

module.exports = { getLichHocByMaLop, createLichHoc, updateLichHoc, deleteLichHoc, kiemTraLichHoc }; 
