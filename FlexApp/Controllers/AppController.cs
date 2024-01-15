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
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AppController(
            IConfiguration configuration,
            DatabaseContext context,
            UserManager<User> userManager, 
            SignInManager<User> signInManager) 
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost( "Login" )]
        public async Task<IActionResult> Login( string userName, string password ) //Działa
        {
            try
            {
                var user = await _userManager.FindByNameAsync( userName );
                if(user != null)
                {
                    // Weryfikuj hasło
                    var verificationResult = _userManager.PasswordHasher.VerifyHashedPassword( user, user.PasswordHash, password );

                    if(verificationResult == PasswordVerificationResult.Success)
                    {
                        // Loguj użytkownika bez ponownego hashowania hasła
                        var result = await _signInManager.PasswordSignInAsync( user.UserName, password, isPersistent: true, lockoutOnFailure: false );
                        if(result.Succeeded)
                        {
                            return Ok( user.Id );
                        }
                    }
                }

                return BadRequest( "Login failed" );
            }
            catch(Exception ex)
            {
                return BadRequest( ex.Message );
            }
        }

        //Rejestracja
        [HttpPost( "Register" )] //Działa
        public IActionResult RegisterNewUser( string userName, string firstName, string lastName, string password )
        {
            try
            {
                User user = new User();
                if(userName != null && firstName != null && lastName != null && password != null)
                {
                    user.UserName = userName;
                    user.FirstName = firstName;
                    user.LastName = lastName;

                    var passwordHasher = new PasswordHasher<User>();
                    user.PasswordHash = passwordHasher.HashPassword( user, password );

                    user.NormalizedUserName = userName.ToUpper();
                    user.Email = "Empty";
                    user.NormalizedEmail = user.Email.ToUpper();
                    user.PhoneNumber = "000000000";
                    user.EmailConfirmed = true;
                    user.PhoneNumberConfirmed = true;
                    user.TwoFactorEnabled = false;
                    user.LockoutEnabled = true;
                    user.AccessFailedCount = 0;
                    user.ConcurrencyStamp = Guid.NewGuid().ToString();
                    user.SecurityStamp = Guid.NewGuid().ToString();

                    // Sprawdź, czy użytkownik już istnieje
                    var checkUser = _context.Users.FirstOrDefault( x => x.UserName == userName );
                    if(checkUser == null)
                    {
                        _context.Users.Add( user );
                        _context.SaveChanges();
                    }
                    else
                    {
                        return BadRequest( "User with this username already exists" );
                    }
                }
                else
                {
                    return BadRequest( "Invalid input: All fields are required" );
                }

                var UserVM = UserViewModel.ToVM( user );
                return Ok( UserVM.Id );
            }
            catch(Exception ex)
            {
                return BadRequest( ex.Message );
            }
        }

        // Informacje o użytkowniku
        [HttpGet("GetUserInformations/{UserId}")]
        [Authorize]
        public IActionResult GetUserInformations(Guid userId)  //Działa
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
        [HttpPost("Logout")] //Działa
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        // Pobieranie ID obecnie zalogowanego użytkownika
        [HttpGet("GetCurrentUserId")] //Działa
        [Authorize]
        public async Task<IActionResult> GetCurrentUserId()
        {
            var user = await _userManager.GetUserAsync(User);
            return Ok(user?.Id);
        }

        // Zmiana hasła
        [HttpPut( "ChangeUserPassword" )] 
        [Authorize]
        public async Task<IActionResult> ChangeUserPassword( Guid userId, string currentPassword, string newPassword) //Działa
        {
            try
            {
                var user = await _userManager.FindByIdAsync( userId.ToString() );
                if(user == null)
                {
                    return BadRequest( "User with this ID does not exist" );
                }

                // Sprawdź, czy obecne hasło jest poprawne
                var passwordVerificationResult = await _userManager.CheckPasswordAsync( user, currentPassword );
                if(!passwordVerificationResult)
                {
                    return BadRequest( "Current password is incorrect" );
                }

                // Zmień hasło
                var result = await _userManager.ChangePasswordAsync( user, currentPassword, newPassword );
                if(result.Succeeded)
                {
                    return Ok( "Password has been changed successfully" );
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BadRequest($"An error occurred while changing the password: {errors}");
                }
            }
            catch(Exception ex)
            {
                return BadRequest( ex.Message );
            }
        }
    }
}
