using FlexApp.Models;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public GroupsController(
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

        [HttpGet("GetLoggedUserGroups")]
        [Authorize]
        public IActionResult GetLoggedUserGroups() // Działa
        {
            try
            {
                // Pobieranie ID aktualnie zalogowanego USERA!!!!
                var userId = _userManager.GetUserId(User);

                List<GroupViewModel> userGroupsViewModels;

                if (userId == null)
                {
                    return Unauthorized("User not logged in");
                }

                // Zbiera ID grup, do których należy zalogowany użytkownik, na podstawie jego UserID
                List<Guid> groupsIdList = _context.UsersInGroups
                                            .Where(x => x.UserId.ToString() == userId)
                                            .Select(x => x.GroupId)
                                            .ToList();

                // Pobiera dane grup na podstawie wcześniej zebranych ID grup użytkownika
                List<Group> userGroups = _context.Groups
                                            .Where(g => groupsIdList.Contains(g.Id))
                                            .ToList();

                userGroupsViewModels = userGroups.Select(group => GroupViewModel.ToVM(group)).ToList();
                return Ok(userGroupsViewModels);
            
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetUsersInGroups")] // Działa
        [Authorize]
        public IActionResult GetUsersInGroup(Guid groupId)
        {
            try
            {
                // Pobieranie użytkowników należących do danej grupy
                List<Guid> usersIdList = _context.UsersInGroups
                                          .Where(x => x.GroupId == groupId)
                                          .Select(x => x.UserId)
                                          .ToList();

                // Pobiera z bazy danych listę użytkowników, których identyfikatory znajdują się w usersIdList
                List<User> users = _context.Users
                                    .Where(u => usersIdList.Contains(u.Id))
                                    .ToList();

                var userViewModels = users.Select(user => UserViewModel.ToVM(user)).ToList();
                return Ok(userViewModels);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while retrieving the users in the group.");
            }
        }

        //Tworzenie grupy
        [HttpPost("CreateGroup")] // Działa
        [Authorize]
        public IActionResult CreateGroup(string Name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(Name))
                {
                    return BadRequest("Group name cannot be empty.");
                }

                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return Unauthorized("User not logged in.");
                }

                var checkIfExist = _context.Groups.FirstOrDefault(x => x.Name == Name);
                if (checkIfExist != null)
                {
                    return BadRequest("Group with this name already exists");
                }

                var group = new Group
                {
                    Name = Name,
                    CreatedById = Guid.TryParse(userId, out var userGuid) ? userGuid : Guid.Empty,
                    InvitationCode = GenerateInvitationCode()
                };

                _context.Groups.Add(group);
                _context.SaveChanges(); // Zapisanie zmian w bazie danych

                return Ok(group);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Dołączanie do grupy
        [HttpPost("JoinGroupWithCode")] // Działa
        [Authorize]
        public IActionResult JoinGroupWithCode(string Code)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return Unauthorized("User not logged in");
                }

                // Znalezienie grupy na podstawie kodu zaproszenia
                var group = _context.Groups.FirstOrDefault(g => g.InvitationCode == Code);
                if (group == null)
                {
                    return BadRequest("No group found with the provided invitation code");
                }

                // Sprawdzenie, czy użytkownik już należy do grupy
                var alreadyInGroup = _context.UsersInGroups
                                             .Any(x => x.UserId.ToString() == userId && x.GroupId == group.Id);
                if (alreadyInGroup)
                {
                    return BadRequest("User is already in the group");
                }

                // Dodanie użytkownika do grupy
                var userInGroup = new UsersInGroups
                {
                    UserId = Guid.Parse(userId),
                    GroupId = group.Id
                };

                _context.UsersInGroups.Add(userInGroup);
                _context.SaveChanges();

                return Ok(group.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetGroupInformations")] // Działa
        [Authorize]
        public IActionResult GetGroupInformations(Guid id)
        {
            try
            {
                // Sprawdzenie, czy grupa o danym ID istnieje
                var groupEntity = _context.Groups.FirstOrDefault(x => x.Id == id);
                if (groupEntity == null)
                {
                    return NotFound("Grupa nie istnieje");
                }

                // Konwersja grupy na ViewModel
                var groupViewModel = GroupViewModel.ToVM(groupEntity);

                return Ok(groupViewModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Usuwanie grupy - tylko dla createdbyid
        [HttpDelete("DeleteGroup")] // Działa
        [Authorize]
        public IActionResult DeleteGroup(Guid id)
        {
            try
            {
                var userId = _userManager.GetUserId(User);

                // Sprawdzenie, czy grupa o danym ID istnieje
                var group = _context.Groups.FirstOrDefault(x => x.Id == id);
                if (group == null)
                {
                    return NotFound("Grupa nie istnieje");
                }

                // Sprawdzenie, czy zalogowany użytkownik jest właścicielem grupy
                if (group.CreatedById.ToString() != userId)
                {
                    return BadRequest("Grupę może usunąć tylko właściciel");
                }

                // Usunięcie wszystkich powiązań użytkowników z grupą
                var usersInGroups = _context.UsersInGroups.Where(x => x.GroupId == id).ToList();
                _context.UsersInGroups.RemoveRange(usersInGroups);
                _context.SaveChanges();

                // Usunięcie grupy
                _context.Groups.Remove(group);
                _context.SaveChanges();

                return Ok("Grupa usunięta");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Generowanie kodu
        public string GenerateInvitationCode()

        {
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var code = new char[6];
            var random = new Random();

            for (int i = 0; i < code.Length; i++)
            {
                code[i] = characters[random.Next(characters.Length)];
            }

            return new string(code);
        }
    }
}
