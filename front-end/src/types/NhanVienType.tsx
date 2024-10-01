export interface NhanVienType {
    key?: string;
    maNhanVien: string;        // Primary key, không NULL
    tenNhanVien: string;       // Không NULL
    img?: string;              // Có thể NULL
    chucVu?: string;           // Có thể NULL
    ngayVaoLam?: string;         // Có thể NULL, kiểu Date
    gioiTinh?: string;         // Có thể NULL
    ngaySinh?: string;           // Có thể NULL, kiểu Date
    sdt?: string;              // Có thể NULL
    email?: string;            // Có thể NULL
    diaChi?: string;           // Có thể NULL
    trangThai?: string;        // Có thể NULL
    ghiChu?: string;
}
