export interface CaHocType {
    key: string;
    maCa: string;          // Primary key, không NULL
    batDau: string;       // Kiểu TIME, có thể NULL
    ketThuc: string;      // Kiểu TIME, có thể NULL
    trangThai?: "Đang hoạt động" | "Ngưng hoạt động";    // Có thể NULL
    ghiChu?: string;
}
