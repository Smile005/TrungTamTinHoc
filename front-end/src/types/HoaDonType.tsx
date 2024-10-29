import { NhanVienType } from "./NhanVienType";
import { HocVienType } from "./HocVienType";

export interface HoaDonType {
    maHoaDon: string;
    maNhanVien: NhanVienType;
    maHocVien: HocVienType;
    ngayTaoHoaDon: string;
    trangThai: "Chờ xác nhận" | "Đã xác nhận" | "Đã hủy" | "Đã đóng học phí";
    ghiChu: string;
}

export interface ChiTietHDType {
    maHoaDon: string;
    maLopHoc: string;
    hocPhi: number;
    ghiChu: string;
}
