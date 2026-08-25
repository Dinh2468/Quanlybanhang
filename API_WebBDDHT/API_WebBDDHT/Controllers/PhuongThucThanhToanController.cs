using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs.ThanhToan;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhuongThucThanhToanController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public PhuongThucThanhToanController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ppThanhToan = await _context.PhuongThucThanhToans.Where(pt => pt.TrangThai == true).ToListAsync();
            var result = _mapper.Map<IEnumerable<PhuongThucThanhToanDto>>(ppThanhToan);
            return Ok(result);
        }
    }
}
