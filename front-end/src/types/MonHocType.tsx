export interface MonHocType {
  key: string;         // Thuộc tính key để giữ lại
  maMonHoc: string;      // Mã môn học
  tenMonHoc: string;     // Tên môn học
  soBuoiHoc?: number;    // Số buổi học, có thể null
  hocPhi?: number;       // Học phí, có thể null
  moTa?: string;         // Mô tả, có thể null
  trangThai?: "Đang hoạt động" | "Tạm Ngưng";   // Trạng thái, có thể null
  ghiChu?: string; 
}