using FlexApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FlexApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;

        public AppController(
            IConfiguration configuration,
            DatabaseContext context) 
        {
            _configuration = configuration;
            _context = context;
        }

        public int NumbOfUsers()
        {
            var users = _context.Users.Count();

            return users;
        }

        public IActionResult CheckUserEmailAndPassword(string email, string password)
        {
            try
            {
                Guid result = new Guid();
                var user = new User();

                if (!string.IsNullOrEmpty(email))
                {
                    user = _context.Users.Where(x => x.Email == email && x.Password == password).FirstOrDefault();
                }

                if (user != null)
                {
                    result = user.Id;
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
