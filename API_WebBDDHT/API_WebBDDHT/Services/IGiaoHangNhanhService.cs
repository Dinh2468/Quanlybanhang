namespace API_WebBDDHT.Services
{
    public interface IGiaoHangNhanhService
    {
        /// trả về dưới dạng chuỗi JSON
        /// <param name="toDistrictId">ID quận/huyện đích.</param>
        /// <param name="toWardCode">Mã phường/xã đích.</param>
        /// <param name="weight">Trọng lượng (đơn vị gram).</param>
        Task<int> CalculateFeeAsync(int toDistrictId, string toWardCode, int weight = 200);/// tính phí giao hàng
        Task<DateTime> CalculateLeadTimeAsync(int toDistrictId, string toWardCode); // Tính thời gian dự kiến giao hàng
        Task<string> GetProvincesAsync();/// lấy danh sách tỉnh/thành phố
        /// <param name="provinceId">ID tỉnh/thành phố.</param>
        Task<string> GetDistrictsAsync(int provinceId);/// lấy quận/huyện theo tỉnh/thành phố
        /// <param name="districtId">ID quận/huyện.</param>
        Task<string> GetWardsAsync(int districtId);// lấy phường xã theo quận/huyện
        Task<string> GetOrderTrackingAsync(string orderCode);// lấy lịch trình đơn hàng theo mã vận đơn
        Task<string> CreateShippingOrderAsync(API_WebBDDHT.Entities.DonHang donHang); // Tạo đơn hàng trên GHN
    }
}
