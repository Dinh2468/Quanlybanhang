using System;
using System.Collections.Generic;
using API_WebBDDHT.DTOs.Admin;

namespace API_WebBDDHT.DTOs.Admin
{
    public record ThongKeTongQuanDto
    {
        public decimal Revenue { get; set; }
        public int OrdersCount { get; set; }
        public int ProductsCount { get; set; }
        public int CustomersCount { get; set; }
        public List<AdminDonHangDto> RecentOrders { get; set; } = new();
    }

    public record ThongKeDoanhThuDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal DoanhThu { get; set; }
        public decimal Von { get; set; }
        public decimal LoiNhuan { get; set; }
        public int SoDonHang { get; set; }
    }

    public record ThongKeDanhMucDto
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public int Percentage { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
