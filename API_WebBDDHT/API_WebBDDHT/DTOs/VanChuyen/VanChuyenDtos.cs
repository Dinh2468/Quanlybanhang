using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API_WebBDDHT.DTOs.VanChuyen
{
    // DTO nhận dữ liệu từ Frontend
    public class TinhPhiVanChuyenRequestDto
    {
        [Required]
        public int ToDistrictId { get; set; } // Mã quận/huyện nhận
        
        [Required]
        public string ToWardCode { get; set; } = null!; // Mã phường/xã nhận

        // Tùy chọn, nếu không truyền sẽ lấy mặc định (vd: 200g)
        public int? Weight { get; set; } 
    }

    // DTO map kết quả trả về từ GHN API
    public class GHNFeeResponseDto
    {
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
        public GHNFeeData? Data { get; set; }
    }

    public class GHNFeeData
    {
        [JsonPropertyName("total")]
        public int Total { get; set; } // Tổng phí vận chuyển (VND)
        
        [JsonPropertyName("service_fee")]
        public int ServiceFee { get; set; }
    }
}
