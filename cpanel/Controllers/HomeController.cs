using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace micpanel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        //private readonly IWebHostEnvironment _env;

        public HomeController(IWebHostEnvironment env)
        {
            //_env = env;
        }
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("micpanel api is running");
        }
    }
}
