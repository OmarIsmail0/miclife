namespace micpanel.Models
{
    public class ApiLog
    {
        public int Id { get; set; }
        public string Method { get; set; }
        public string Path { get; set; }
        public string? QueryString { get; set; }
        public string? RequestBody { get; set; }
        public string? ResponseBody { get; set; }
        public int StatusCode { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? IpAddress { get; set; }
        public DateTime Timestamp { get; set; }
        public long Duration { get; set; } // Duration in milliseconds
    }
}
