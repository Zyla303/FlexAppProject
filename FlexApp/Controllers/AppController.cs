using FlexApp.Models;
using FlexApp.ViewModels;
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

        //Logowanie - przykładowe endpointy do uzupełnienia W KAŻDEJ FUNKCJI
        [HttpGet]
        [Route("Login")]
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

        //Rejestracja
        public IActionResult RegisterNewUser(string name, string email, string password)
        {
            try
            {
                User user = new User();
                if(name != null && email != null && password != null)
                {
                    user.Name = name;
                    user.Email = email;
                    user.Password = password;
                    user.EmailConfirmed = "true"; // Pola potwierdzenia emaila i hasła, niepotrzebne ale już w bazie
                    user.PasswordConfirmed = "true"; // Pola potwierdzenia emaila i hasła, niepotrzebne ale już w bazie
                    
                    //Sprawdzenie czy user istnieje w bazie
                    var checkUser = _context.Users.Where(x=>x.Email == email).FirstOrDefault();
                    if(checkUser == null) { 
                        _context.Users.Add(user);
                        _context.SaveChanges();
                    }
                    else
                    {
                        return BadRequest("Użytkownik istnieje w bazie!");
                    }

                }
                //Zwracamy całego usera z jego id, może posłużyć do automatycznego zalogowania po rejestracji - najpierw mapujemy na VM
                var UserVM = UserViewModel.ToVM(user);
                return Ok(UserVM);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Informacje o userze
        public IActionResult GetUserInformations(Guid UserId)
        {
            try
            {
                UserViewModel userVM = new UserViewModel();
                if (UserId != null)
                {
                    var user = _context.Users.Where(x=>x.Id == UserId).FirstOrDefault();
                    if (user == null)
                    {
                        return BadRequest("Użytkownik nie istnieje");
                    }
                    userVM = UserViewModel.ToVM(user);
                }
                return Ok(userVM);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Zmiana hasła
        public IActionResult GetUserInformations(string Email, string Name, string NewPassword)
        {
            try
            {
                var userInfo = _context.Users.Where(x=>x.Email.Contains(Email) && x.Name.Contains(Name)).FirstOrDefault();
                if(userInfo == null)
                {
                    return BadRequest("Nie istnieje użytkownik o takim emailu lub nazwie");
                }
                else
                {
                    userInfo.Password = NewPassword;
                    _context.SaveChanges();
                }
                return Ok("Hasło zostało zmienione");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
