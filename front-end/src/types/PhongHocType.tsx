export interface PhongHocType {
    key: String;
    maPhong: string;       // Primary key, không NULL
    soLuong?: number;      // Kiểu INT, có thể NULL
    trangThai?: "Đang Hoạt Động" | "Ngưng Hoạt Động";
    ghiChu?: string;
}
