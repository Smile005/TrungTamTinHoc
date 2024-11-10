export interface BuoiHocType {
    maLichHoc?: string;
    maMonHoc: string;
    tenMonHoc: string;
    maLopHoc: string;
    tenLopHoc: string;
    maGiaoVien: string;
    tenGiaoVien: string;
    maCa: string;
    maPhong: string;
    ngayHoc: string; 
    loai: "Ngày học" | "Ngày nghỉ" | "Ngày thi";
    trangThai: "Đã lên lịch" | "Đã hủy";
    ghiChu: string;
}
