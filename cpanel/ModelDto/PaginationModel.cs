namespace micpanel.ModelDto
{
        public class PaginationRequest
        {
            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string? SortBy { get; set; } = "Timestamp";
            public bool SortDescending { get; set; } = true;
            public PeriodModel? PeriodModel { get; set; }
        }

        public class PaginationResponse<T>
        {
            public IEnumerable<T> Data { get; set; } = new List<T>();
            public int TotalCount { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public int TotalPages { get; set; }
            public bool HasPreviousPage { get; set; }
            public bool HasNextPage { get; set; }
        }
}
