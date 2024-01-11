using FlexApp.Models;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;

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

        // Logowanie
        [HttpPost("Login")] //TODO naprawić
        public async Task<IActionResult> Login(string userName, string password)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, password, isPersistent: true, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        // Użytkownik jest zalogowany, plik cookie sesji został utworzony.
                        return Ok(user.Id);
                    }
                }

                return BadRequest("Login failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Rejestracja
        [HttpPost("Register")] 
        public IActionResult RegisterNewUser(string userName, string firstName, string lastName, string password)
        {
            try
            {
                User user = new User();
                if(userName != null && firstName != null && lastName != null && password != null)
                {
                    user.UserName = userName;
                    user.FirstName = firstName;
                    user.LastName = lastName;
                    user.Password = password;
                    
                    //Sprawdzenie czy user istnieje w bazie
                    var checkUser = _context.Users.Where(x=>x.UserName == userName).FirstOrDefault();
                    if(checkUser == null) { 
                        _context.Users.Add(user);
                        _context.SaveChanges();
                    }
                    else
                    {
                        return BadRequest("User with this username already exists");
                    }
                }
                else
                {
                    return BadRequest("Invalid input: Username, first name, last name, and password are required");
                }
                // Zwracamy całego usera z jego id, może posłużyć do automatycznego zalogowania po rejestracji - najpierw mapujemy na VM
                var UserVM = UserViewModel.ToVM(user);
                return Ok(UserVM);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Informacje o użytkowniku
        [HttpGet("GetUserInformations/{UserId}")] 
        public IActionResult GetUserInformations(Guid userId)
        {
            try
            {
                UserViewModel userVM = new UserViewModel();
                if (userId != Guid.Empty)
                {
                    var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
                    if (user == null)
                    {
                        return BadRequest("User with this ID does not exist");
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

        // Wylogowanie
        [HttpPost("Logout")] //TODO przetestować (logowanie nie działa)
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        // Pobieranie ID obecnie zalogowanego użytkownika
        [HttpGet("GetCurrentUserId")] //TODO przetestować (logowanie nie działa)
        [Authorize]
        public async Task<IActionResult> GetCurrentUserId()
        {
            var user = await _userManager.GetUserAsync(User);
            return Ok(user?.Id);
        }

        // Zmiana hasła
        [HttpPut("ChangeUserPassword")] //TODO przetestować (logowanie nie działa)
        [Authorize]
        public IActionResult ChangeUserPassword(Guid userId, string currentPassword, string newPassword)
        {
            try
            {
                var userInfo = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
                if (userInfo == null)
                {
                    return BadRequest("User with this ID does not exist");
                }
                else if (userInfo.Password != currentPassword)
                {
                    return BadRequest("Wrong password");
                }
                else
                {
                    userInfo.Password = newPassword;
                    _context.SaveChanges();
                }
                return Ok("Password has been changed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
