using FlexApp.Models;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlexApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AppController(
            IConfiguration configuration,
            DatabaseContext context,
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager) 
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public int NumbOfUsers()
        {
            var users = _context.Users.Count();

            return users;
        }

        //Logowanie - przykładowe endpointy do uzupełnienia W KAŻDEJ FUNKCJI
        [HttpGet]
        [Route("Login")]
        public async Task<IActionResult> CheckUserEmailAndPassword(string email, string password)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, password, isPersistent: true, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        // Użytkownik jest zalogowany, plik cookie sesji został utworzony.
                        return Ok(user.Id);
                    }
                }

                return BadRequest("Nieudane logowanie.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Wylogowanie
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        //Pobieranie obecnie zalogowanego usera
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserId()
        {
            var user = await _userManager.GetUserAsync(User);
            return Ok(user?.Id);
        }

        //Rejestracja
        public IActionResult RegisterNewUser(string name, string password)
        {
            try
            {
                User user = new User();
                if(name != null && password != null)
                {
                    user.Name = name;
                    user.Email = "";
                    user.Password = password;
                    user.EmailConfirmed = "true"; // Pola potwierdzenia emaila i hasła, niepotrzebne ale już w bazie
                    user.PasswordConfirmed = "true"; // Pola potwierdzenia emaila i hasła, niepotrzebne ale już w bazie
                    
                    //Sprawdzenie czy user istnieje w bazie
                    var checkUser = _context.Users.Where(x=>x.Email == name).FirstOrDefault();
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
        public IActionResult ChangeUserPassword(string Name, string NewPassword)
        {
            try
            {
                var userInfo = _context.Users.Where(x => x.Name.Contains(Name)).FirstOrDefault();
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
