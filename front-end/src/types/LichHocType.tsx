export interface LichHocType {
    maLichHoc: string;
    maLopHoc: string;
    maGiaoVien: string;
    maCa: string;
    maPhong: string;
    thu: number; // Chủ nhật là 0, thứ 2 là
    soBuoi: number;
    ghiChu?: string;
}

export interface BuoiHocType {
    maLichHoc: string;
    maLopHoc: string;
    maGiaoVien: string;
    maCa: string;
    maPhong: string;
    ngayHoc: string;
    trangThai: string;
    ghiChu?: string;
}
