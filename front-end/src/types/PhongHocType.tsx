export interface PhongHocType {
    key: String;
    maPhong: string;       // Primary key, không NULL
    soLuong?: number;      // Kiểu INT, có thể NULL
    trangThai?: "Đang hoạt động" | "Ngưng hoạt động";
    ghiChu?: string;
}
