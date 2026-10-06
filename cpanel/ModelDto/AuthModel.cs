namespace micpanel.ModelDto
{
    public class AuthModel
    {
        public string? Message { get; set; }
        public bool IsAuthenticated { get; set; } = false;
        public bool IsFactorAuth { get; set; }
        public string? FactorAuthCod { get; set; }
        public string? Username { get; set; }
        public string? FullName { get; set; }
        public int InternalCod { get; set; }
        public string? Email { get; set; }
        public int Department { get; set; }
        public int Branch { get; set; }
        public List<string>? Roles { get; set; }
        public string? Token { get; set; }
        public DateTime ExpiresOn { get; set; }
    }
}
