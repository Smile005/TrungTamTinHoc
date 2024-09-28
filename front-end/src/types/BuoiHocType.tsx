import { CaHocType } from "./CaHocType";
import { NhanVienType } from "./NhanVienType";
import { PhongHocType } from "./PhongHocType";

export interface BuoiHocType {
    maBuoiHoc: string;
    maLichHoc?: string;
    tenLopHoc: string;
    ngayHoc: Date;
    caHoc: CaHocType;
    phongHoc: PhongHocType;
    giaoVien: NhanVienType;
    loai: "Ngày học"| "Ngày nghỉ" | "Ngày thi";
    trangThai:"Đã lên lịch" | "Đã hủy";
    ghiChu: string;
}
