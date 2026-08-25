namespace API_WebBDDHT.DTOs
{
    public class PagedResult<T>
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public object AdditionalData { get; set; }
    }
}
