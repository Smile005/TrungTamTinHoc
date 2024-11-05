export interface DsLopHocType {
  maLopHoc: string;   
  maHocVien: string;
  trangThai: string;  
  ghiChu?: string;
  diemThuongKy?: number | null; // Đổi từ string sang number để phù hợp với kiểu dữ liệu đang sử dụng
    diemGiuaKy?: number | null;
    diemCuoiKy?: number | null;  
}