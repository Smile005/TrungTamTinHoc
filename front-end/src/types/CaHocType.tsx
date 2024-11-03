export interface CaHocType {
    key: string;
    maCa: string;          // Primary key, không NULL
    batDau: string;       // Kiểu TIME, có thể NULL
    ketThuc: string;      // Kiểu TIME, có thể NULL
    trangThai?: "Đang Hoạt Động" | "Ngưng Hoạt Động";    // Có thể NULL
    ghiChu?: string;
}
