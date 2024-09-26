export interface HocVienType {
    key: string;
    maHocVien: string;      // Primary key
    tenHocVien: string;     // NOT NULL
    img?: string;           // Có thể null
    ngayVaoHoc?: string;      // Có thể null, sử dụng kiểu Date của JavaScript
    ngaySinh?: string;        // Có thể null, sử dụng kiểu Date của JavaScript
    gioiTinh?: string;      // Có thể null
    sdt?: string;           // Có thể null
    email?: string;         // Có thể null
    diaChi?: string;      
    tinhTrang?: string;     
    ghiChu?: string;
}
