const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('src/data/diemchuan.json');
const data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

// The 86 official entries from the images
const officialScores = [
  {"Mã ngành": "7140231V", "Tên ngành": "Sư phạm tiếng Anh (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "29.57"},
  {"Mã ngành": "7140246V", "Tên ngành": "Sư phạm công nghệ (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.79"},
  {"Mã ngành": "7210403V", "Tên ngành": "Thiết kế đồ họa (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.60"},
  {"Mã ngành": "7210404V", "Tên ngành": "Thiết kế thời trang (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.70"},
  {"Mã ngành": "7220201BP", "Tên ngành": "Ngôn ngữ Anh (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "24.00"},
  {"Mã ngành": "7220201V", "Tên ngành": "Ngôn ngữ Anh (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.60"},
  {"Mã ngành": "7310403V", "Tên ngành": "Tâm lý học giáo dục (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.18"},
  {"Mã ngành": "7320106V", "Tên ngành": "Công nghệ truyền thông (Truyền thông số và Công nghệ đa phương tiện) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.50"},
  {"Mã ngành": "7340101V", "Tên ngành": "Quản trị kinh doanh (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.74"},
  {"Mã ngành": "7340120BP", "Tên ngành": "Kinh doanh Quốc tế (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "24.50"},
  {"Mã ngành": "7340120V", "Tên ngành": "Kinh doanh Quốc tế (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.95"},
  {"Mã ngành": "7340122BP", "Tên ngành": "Thương mại điện tử (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "24.70"},
  {"Mã ngành": "7340122V", "Tên ngành": "Thương mại điện tử (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.70"},
  {"Mã ngành": "7340205V", "Tên ngành": "Công nghệ tài chính (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.70"},
  {"Mã ngành": "7340301A", "Tên ngành": "Kế toán (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "23.65"},
  {"Mã ngành": "7340301BP", "Tên ngành": "Kế toán (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "23.55"},
  {"Mã ngành": "7340301V", "Tên ngành": "Kế toán (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "23.65"},
  {"Mã ngành": "7380101V", "Tên ngành": "Luật (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.73"},
  {"Mã ngành": "7480108A", "Tên ngành": "Công nghệ Kỹ thuật máy tính (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "25.45"},
  {"Mã ngành": "7480108V", "Tên ngành": "Công nghệ Kỹ thuật máy tính (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.20"},
  {"Mã ngành": "7480118V", "Tên ngành": "Hệ thống nhúng và IoT (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.90"},
  {"Mã ngành": "7480201A", "Tên ngành": "Công nghệ thông tin (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "26.40"},
  {"Mã ngành": "7480201BP", "Tên ngành": "Công nghệ thông tin (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "24.75"},
  {"Mã ngành": "7480201N", "Tên ngành": "Công nghệ thông tin (chương trình Việt - Nhật)", "Điểm chuẩn": "24.55"},
  {"Mã ngành": "7480201V", "Tên ngành": "Công nghệ thông tin (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "27.45"},
  {"Mã ngành": "7480202V", "Tên ngành": "An toàn thông tin (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.00"},
  {"Mã ngành": "7480203V", "Tên ngành": "Kỹ thuật dữ liệu (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.10"},
  {"Mã ngành": "7510102A", "Tên ngành": "Công nghệ Kỹ thuật công trình xây dựng (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "21.55"},
  {"Mã ngành": "7510102V", "Tên ngành": "Công nghệ Kỹ thuật công trình xây dựng (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.70"},
  {"Mã ngành": "7510106V", "Tên ngành": "Hệ thống kỹ thuật công trình xây dựng (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.27"},
  {"Mã ngành": "7510201A", "Tên ngành": "Công nghệ Kỹ thuật cơ khí (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "23.64"},
  {"Mã ngành": "7510201BP", "Tên ngành": "Công nghệ Kỹ thuật cơ khí (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "23.37"},
  {"Mã ngành": "7510201TDA", "Tên ngành": "Chương trình đào tạo Cơ khí - Tự động Hóa (thuộc ngành Công nghệ Kỹ thuật Cơ khí) (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "23.37"},
  {"Mã ngành": "7510201V", "Tên ngành": "Công nghệ Kỹ thuật cơ khí (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.45"},
  {"Mã ngành": "7510202A", "Tên ngành": "Công nghệ chế tạo máy (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "22.80"},
  {"Mã ngành": "7510202N", "Tên ngành": "Công nghệ chế tạo máy (chương trình Việt - Nhật)", "Điểm chuẩn": "22.80"},
  {"Mã ngành": "7510202V", "Tên ngành": "Công nghệ chế tạo máy (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.15"},
  {"Mã ngành": "7510203A", "Tên ngành": "Công nghệ Kỹ thuật cơ điện tử (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "25.00"},
  {"Mã ngành": "7510203V", "Tên ngành": "Công nghệ Kỹ thuật cơ điện tử (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "27.70"},
  {"Mã ngành": "7510205A", "Tên ngành": "Công nghệ Kỹ thuật ô tô (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "24.15"},
  {"Mã ngành": "7510205BP", "Tên ngành": "Công nghệ Kỹ thuật ô tô (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "23.60"},
  {"Mã ngành": "7510205N", "Tên ngành": "Công nghệ Kỹ thuật ô tô (chương trình Việt - Nhật)", "Điểm chuẩn": "23.55"},
  {"Mã ngành": "7510205V", "Tên ngành": "Công nghệ Kỹ thuật ô tô (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.65"},
  {"Mã ngành": "7510206A", "Tên ngành": "Công nghệ Kỹ thuật nhiệt (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "22.30"},
  {"Mã ngành": "7510206N", "Tên ngành": "Công nghệ Kỹ thuật nhiệt (chương trình Việt - Nhật)", "Điểm chuẩn": "24.70"},
  {"Mã ngành": "7510206V", "Tên ngành": "Công nghệ Kỹ thuật nhiệt (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.70"},
  {"Mã ngành": "7510208V", "Tên ngành": "Năng lượng tái tạo (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.00"},
  {"Mã ngành": "7510209V", "Tên ngành": "Robot và trí tuệ nhân tạo (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "27.50"},
  {"Mã ngành": "7510301A", "Tên ngành": "Công nghệ Kỹ thuật điện, điện tử (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "24.25"},
  {"Mã ngành": "7510301BP", "Tên ngành": "Công nghệ Kỹ thuật điện, điện tử (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "23.50"},
  {"Mã ngành": "7510301V", "Tên ngành": "Công nghệ Kỹ thuật điện, điện tử (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.75"},
  {"Mã ngành": "7510302A", "Tên ngành": "Công nghệ Kỹ thuật điện tử - viễn thông (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "24.20"},
  {"Mã ngành": "7510302KTVM", "Tên ngành": "Chương trình đào tạo Kỹ thuật Thiết kế vi mạch (thuộc ngành CNKT Điện tử - viễn thông) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "28.65"},
  {"Mã ngành": "7510302N", "Tên ngành": "Công nghệ Kỹ thuật điện tử - viễn thông (chương trình Việt - Nhật)", "Điểm chuẩn": "23.00"},
  {"Mã ngành": "7510302V", "Tên ngành": "Công nghệ Kỹ thuật điện tử - viễn thông (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "26.45"},
  {"Mã ngành": "7510303A", "Tên ngành": "Công nghệ Kỹ thuật điều khiển và tự động hóa (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "25.75"},
  {"Mã ngành": "7510303BP", "Tên ngành": "Công nghệ Kỹ thuật điều khiển và tự động hóa (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "25.45"},
  {"Mã ngành": "7510303V", "Tên ngành": "Công nghệ Kỹ thuật điều khiển và tự động hóa (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "28.70"},
  {"Mã ngành": "7510401A", "Tên ngành": "Công nghệ Kỹ thuật hóa học (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "24.10"},
  {"Mã ngành": "7510401V", "Tên ngành": "Công nghệ Kỹ thuật hóa học (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "28.35"},
  {"Mã ngành": "7510402A", "Tên ngành": "Công nghệ vật liệu (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "24.55"},
  {"Mã ngành": "7510402V", "Tên ngành": "Công nghệ vật liệu (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.55"},
  {"Mã ngành": "7510406V", "Tên ngành": "Công nghệ Kỹ thuật môi trường (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "23.10"},
  {"Mã ngành": "7510601A", "Tên ngành": "Quản lý công nghiệp (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "22.00"},
  {"Mã ngành": "7510601BP", "Tên ngành": "Quản lý công nghiệp (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "22.00"},
  {"Mã ngành": "7510601V", "Tên ngành": "Quản lý công nghiệp (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.60"},
  {"Mã ngành": "7510605BP", "Tên ngành": "Logistics và quản lý chuỗi cung ứng (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "25.00"},
  {"Mã ngành": "7510605V", "Tên ngành": "Logistics và quản lý chuỗi cung ứng (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "27.65"},
  {"Mã ngành": "7510801V", "Tên ngành": "Công nghệ Kỹ thuật in (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.10"},
  {"Mã ngành": "7520117V", "Tên ngành": "Kỹ thuật công nghiệp (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.10"},
  {"Mã ngành": "7520212A", "Tên ngành": "Kỹ thuật y sinh (Điện tử y sinh) (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "22.15"},
  {"Mã ngành": "7520212V", "Tên ngành": "Kỹ thuật y sinh (Điện tử y sinh) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "25.80"},
  {"Mã ngành": "7520401V", "Tên ngành": "Vật lý kỹ thuật (định hướng công nghệ bán dẫn và cảm biến, đo lường) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "28.65"},
  {"Mã ngành": "7540101A", "Tên ngành": "Công nghệ thực phẩm (đào tạo bằng tiếng Anh)", "Điểm chuẩn": "22.00"},
  {"Mã ngành": "7540101DD", "Tên ngành": "Chương trình đào tạo Khoa học thực phẩm & Dinh dưỡng (thuộc ngành Công nghệ thực phẩm) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.15"},
  {"Mã ngành": "7540101V", "Tên ngành": "Công nghệ thực phẩm (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "24.85"},
  {"Mã ngành": "7540209V", "Tên ngành": "Công nghệ may (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.00"},
  {"Mã ngành": "7549002V", "Tên ngành": "Kỹ thuật gỗ và nội thất (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "21.10"},
  {"Mã ngành": "7580101V", "Tên ngành": "Kiến trúc (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "21.75"},
  {"Mã ngành": "7580103V", "Tên ngành": "Kiến trúc nội thất (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "21.20"},
  {"Mã ngành": "7580205V", "Tên ngành": "Kỹ thuật xây dựng công trình giao thông (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.50"},
  {"Mã ngành": "7580302BP", "Tên ngành": "Quản lý xây dựng (đào tạo tại phân hiệu Bình Phước)", "Điểm chuẩn": "22.50"},
  {"Mã ngành": "7580302V", "Tên ngành": "Quản lý xây dựng (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.50"},
  {"Mã ngành": "7810202V", "Tên ngành": "Quản trị NH và DV ăn uống (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "23.35"},
  {"Mã ngành": "7840110V", "Tên ngành": "Quản lý và vận hành hạ tầng (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "22.00"},
  {"Mã ngành": "7850101V", "Tên ngành": "Chương trình đào tạo Môi trường và Phát triển bền vững (thuộc ngành Quản lý tài nguyên & môi trường) (đào tạo bằng tiếng Việt)", "Điểm chuẩn": "21.25"}
];

if (data["SPK"]) {
  // Capture existing combinations to keep them meaningful if possible, 
  // but the user wants to reduce to 86 entries total.
  // We'll create exactly 86 score objects.
  
  const oldScores = data["SPK"].scores;
  
  const finalScores = officialScores.map(official => {
    // Find matching combinations from old data for this code
    const matches = oldScores.filter(s => s["Mã ngành"] === official["Mã ngành"]);
    const combinations = matches.length > 0 
      ? [...new Set(matches.map(m => m["Tổ hợp môn"]))].join("; ")
      : ""; // If no match, leave blank or use a placeholder
      
    return {
      "Mã ngành": official["Mã ngành"],
      "Tên ngành": official["Tên ngành"],
      "Tổ hợp môn": combinations || "A00; A01; D01; D07", // Defaulting to common ones if missing
      "Điểm chuẩn": official["Điểm chuẩn"],
      "Ghi chú": ""
    };
  });
  
  data["SPK"].scores = finalScores;
  console.log(`Purged excess data. Now SPK has exactly ${finalScores.length} entries.`);
} else {
  console.error("SPK not found.");
}

fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
