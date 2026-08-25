using System.Text;
using System.Text.Json;
using API_WebBDDHT.DTOs.VanChuyen;
using Microsoft.Extensions.Configuration;

namespace API_WebBDDHT.Services
{
    public class GiaoHangNhanhService : IGiaoHangNhanhService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GiaoHangNhanhService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<int> CalculateFeeAsync(int toDistrictId, string toWardCode, int weight = 200)
        {
            var token = _configuration["GHN:Token"];
            var shopId = _configuration["GHN:ShopId"];
            var apiUrl = _configuration["GHN:ApiUrl"] ?? "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(shopId))
            {
                throw new Exception("Chưa cấu hình Token hoặc ShopId của Giao Hàng Nhanh.");
            }

            var requestData = new
            {
                service_type_id = 2, // 2 là loại dịch vụ "Chuyển phát truyền thống". Dùng service_type_id để hệ thống tự động tìm mã service_id phù hợp với tuyến đường
                insurance_value = 0,
                coupon = (string?)null,
                to_district_id = toDistrictId,
                to_ward_code = toWardCode,
                weight = weight,
                length = 10,
                width = 10,
                height = 10
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            // Xóa header cũ nếu HttpClient được tái sử dụng
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);
            _httpClient.DefaultRequestHeaders.Add("ShopId", shopId);

            var response = await _httpClient.PostAsync(apiUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi khi gọi API GHN: {response.StatusCode} - {errorResult}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<GHNFeeResponseDto>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result != null && result.Code == 200 && result.Data != null)
            {
                return result.Data.Total;
            }

            throw new Exception($"Lỗi từ hệ thống GHN: {result?.Message}");
        }

        public async Task<DateTime> CalculateLeadTimeAsync(int toDistrictId, string toWardCode)
        {
            var token = _configuration["GHN:Token"];
            var shopId = _configuration["GHN:ShopId"];
            var apiUrl = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime";

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(shopId))
            {
                throw new Exception("Chưa cấu hình Token hoặc ShopId của Giao Hàng Nhanh.");
            }

            var requestData = new
            {
                to_district_id = toDistrictId,
                to_ward_code = toWardCode
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);
            _httpClient.DefaultRequestHeaders.Add("ShopId", shopId);

            var response = await _httpClient.PostAsync(apiUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi khi gọi API tính thời gian giao hàng GHN: {response.StatusCode} - {errorResult}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(responseString);
            var leadtimeTimestamp = document.RootElement.GetProperty("data").GetProperty("leadtime").GetInt64();
            
            // GHN trả về Unix timestamp, convert sang DateTime
            var expectedDeliveryTime = DateTimeOffset.FromUnixTimeSeconds(leadtimeTimestamp).LocalDateTime;
            return expectedDeliveryTime;
        }

        public async Task<string> GetProvincesAsync()
        {
            var token = _configuration["GHN:Token"];
            var apiUrl = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);

            var response = await _httpClient.GetAsync(apiUrl);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetDistrictsAsync(int provinceId)
        {
            var token = _configuration["GHN:Token"];
            var apiUrl = $"https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id={provinceId}";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);

            var response = await _httpClient.GetAsync(apiUrl);
            
            // Theo tài liệu GHN mới nhất, API lấy district dùng GET master-data/district
            // GHN v2 hỗ trợ Header Token cho GET.
            
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetWardsAsync(int districtId)
        {
            var token = _configuration["GHN:Token"];
            // API lấy xã dùng GET hoặc POST. Nếu dùng POST cần truyền district_id vào body, hoặc GET với query.
            // Dùng GET theo chuẩn phổ biến
            var apiUrl = $"https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id={districtId}";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);

            var response = await _httpClient.GetAsync(apiUrl);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> CreateShippingOrderAsync(API_WebBDDHT.Entities.DonHang donHang)
        {
            var token = _configuration["GHN:Token"];
            var shopId = _configuration["GHN:ShopId"];
            var apiUrl = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";

            var items = new List<object>();
            int totalWeight = 0;

            foreach (var ct in donHang.ChiTietDonHangs)
            {
                int weight = 200 * ct.SoLuong; // Mặc định 200g nếu ko có
                if (ct.SanPham != null && ct.SanPham.CanNang > 0)
                {
                    weight = ct.SanPham.CanNang * ct.SoLuong;
                }
                totalWeight += weight;

                items.Add(new
                {
                    name = ct.SanPham?.TenSP ?? "Sản phẩm văn phòng phẩm",
                    code = ct.MaSP.ToString(),
                    quantity = ct.SoLuong,
                    price = (int)ct.DonGia,
                    weight = weight
                });
            }

            if (totalWeight == 0) totalWeight = 200;

            var requestBody = new
            {
                payment_type_id = 1, // 1: Shop trả phí
                note = donHang.GhiChu ?? "",
                required_note = "CHOXEMHANGKHONGTHU", 
                to_name = donHang.HoTenNguoiNhan,
                to_phone = donHang.SDTNguoiNhan,
                to_address = donHang.DiaChiGiaoHang,
                to_ward_code = donHang.MaPhuongXa,
                to_district_id = donHang.MaQuanHuyen,
                cod_amount = donHang.TrangThaiThanhToan == "Đã thanh toán" ? 0 : (int)(donHang.TongTien ?? 0),
                weight = totalWeight,
                length = 20,
                width = 20,
                height = 10,
                service_type_id = 2,
                items = items
            };

            var request = new HttpRequestMessage(HttpMethod.Post, apiUrl);
            request.Headers.Add("Token", token);
            request.Headers.Add("ShopId", shopId);
            var json = JsonSerializer.Serialize(requestBody);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Lỗi khi tạo đơn trên GHN: {responseContent}");
            }

            using var doc = JsonDocument.Parse(responseContent);
            var orderCode = doc.RootElement.GetProperty("data").GetProperty("order_code").GetString();

            return orderCode ?? "";
        }
        
        public async Task<string> GetOrderTrackingAsync(string orderCode)
        {
            var token = _configuration["GHN:Token"];
            var apiUrl = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail";

            var requestData = new
            {
                order_code = orderCode
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Token", token);

            var response = await _httpClient.PostAsync(apiUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi khi gọi API GHN tracking: {response.StatusCode} - {errorResult}");
            }

            return await response.Content.ReadAsStringAsync();
        }
    }
}
