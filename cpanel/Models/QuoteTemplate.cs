namespace micpanel.Models
{
    public class QuoteTemplate
    {
        public int Id { get; set; }
        public string RandomId { get; set; }
        public string Name { get; set; }
        public int FormTemplateId { get; set; }
        public string Type { get; set; }
        public string? ReplyJson { get; set; }
        public string? Contact { get; set; }
        public bool Replied { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public DateTime? Expiration { get; set; }
        public bool isActive { get; set; } = true;
        
        // Navigation property
        public FormTemplate? FormTemplate { get; set; }
    }
}
