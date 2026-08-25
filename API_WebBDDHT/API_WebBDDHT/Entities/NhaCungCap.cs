using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_WebBDDHT.Entities
{
    [Table("NhaCungCap")]
    public class NhaCungCap
    {
        [Key]
        [Column("MaNCC")]
        public int MaNCC { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenNCC")]
        public string TenNCC { get; set; } = null!;

        [Column("DiaChi")]
        public string? DiaChi { get; set; }

        [StringLength(20)]
        [Column("SDT")]
        public string? SDT { get; set; }

        [StringLength(100)]
        [Column("Email")]
        public string? Email { get; set; }

    }
}
