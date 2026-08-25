using API_WebBDDHT.DTOs.VanChuyen;
using API_WebBDDHT.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VanChuyenController : ControllerBase
    {
        private readonly IGiaoHangNhanhService _giaoHangNhanhService;

        public VanChuyenController(IGiaoHangNhanhService giaoHangNhanhService)
        {
            _giaoHangNhanhService = giaoHangNhanhService;
        }

        [HttpPost("tinh-phi")]
        public async Task<IActionResult> TinhPhiVanChuyen([FromBody] TinhPhiVanChuyenRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Nếu FE không truyền weight, dùng mặc định 200g
                int weight = request.Weight ?? 200;

                var fee = await _giaoHangNhanhService.CalculateFeeAsync(request.ToDistrictId, request.ToWardCode, weight);
                var leadTime = await _giaoHangNhanhService.CalculateLeadTimeAsync(request.ToDistrictId, request.ToWardCode);

                return Ok(new
                {
                    phiVanChuyen = fee,
                    thoiGianDuKienGiao = leadTime.ToString("yyyy-MM-ddTHH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                // Lỗi có thể do chưa cấu hình key GHN hoặc dữ liệu không hợp lệ từ GHN
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("tinh-thanh")]
        public async Task<IActionResult> GetProvinces()
        {
            try
            {
                var provinces = await _giaoHangNhanhService.GetProvincesAsync();
                return Content(provinces, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("quan-huyen")]
        public async Task<IActionResult> GetDistricts([FromQuery] int province_id)
        {
            try
            {
                var districts = await _giaoHangNhanhService.GetDistrictsAsync(province_id);
                return Content(districts, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("phuong-xa")]
        public async Task<IActionResult> GetWards([FromQuery] int district_id)
        {
            try
            {
                var wards = await _giaoHangNhanhService.GetWardsAsync(district_id);
                return Content(wards, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
