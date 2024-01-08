using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FlexApp.Models;
using System;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    public class GroupsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public GroupsController(IConfiguration configuration, 
            DatabaseContext context,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager)
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        public IActionResult GetLoggedUserGroups()
        {
            try
            {
                // Pobieranie ID aktualnie zalogowanego USERA!!!!
                var userId = _userManager.GetUserId(User);

                List<UsersInGroupsViewModel> userGroups = new List<UsersInGroupsViewModel>();

                if (userId != null)
                {
                    var userGroupsFromDB = _context.UsersInGroups.Where(x => x.UserId.ToString() == userId);
                    userGroups = userGroupsFromDB.Select(x => UsersInGroupsViewModel.ToVM(x)).ToList();
                }

                return Ok(userGroups);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public IActionResult GetUsersInGroups(Guid GroupId)
        {
            try
            {
                List<UserViewModel> usersInGroup = new List<UserViewModel>();

                if (GroupId != null)
                {
                    var usersInGroupDB = _context.Users.Where(u => _context.UsersInGroups.Any(x => x.GroupId == GroupId));
                    usersInGroup = usersInGroupDB.Select(x => UserViewModel.ToVM(x)).ToList();
                }


                return Ok(usersInGroup);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Tworzenie grupy
        public IActionResult CreateGroup(string Name)
        {
            try
            {
                GroupViewModel group = new GroupViewModel();
                var userId = _userManager.GetUserId(User);

                if (Name != null)
                {
                    var checkIfExist = _context.Groups.Where(x=>x.Name == Name).FirstOrDefault();

                    if (checkIfExist != null)
                    {
                        return BadRequest("Grupa istnieje");

                    }
                    else
                    {
                        group.Name = Name;
                        if (Guid.TryParse(userId, out var userGuid))
                        {
                            group.CreatedById = userGuid;
                        }
                        group.InvitationCode = GenerateInvitationCode();

                    }
                }


                return Ok(group);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Dołączanie do grupy
        public IActionResult CreateGroup(Guid GroupId, string Code)
        {
            try
            {
                var userInGroup = new UsersInGroups();
                var userId = _userManager.GetUserId(User);

                var confCode = _context.Groups.Where(x=>x.Id == GroupId).Select(x=>x.InvitationCode).FirstOrDefault();
                if (confCode != null && confCode == Code)
                {
                    var alreadyInGroup = _context.UsersInGroups.Where(x => x.UserId.ToString() == userId && x.GroupId == GroupId).FirstOrDefault();

                    if (alreadyInGroup != null)
                    {
                        return BadRequest("Użytkownik jest już w grupie");
                    }
                    else
                    {
                        if (Guid.TryParse(userId, out var userGuid))
                        {
                            userInGroup.UserId = userGuid;
                        }
                        userInGroup.GroupId = GroupId;
                        userInGroup.ConfirmParticipation = true;

                        _context.UsersInGroups.Add(userInGroup);
                        _context.SaveChanges();
                    }
                }
                else
                {
                    return BadRequest("Grupa nie istnieje lub podany kod jest błędny");
                }


                return Ok(userInGroup);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Pobieranie informacji o danej grupie
        public IActionResult CreateGroup(Guid Id)
        {
            try
            {
                GroupViewModel group = new GroupViewModel();

                var checkIfExist = _context.Groups.Where(x => x.Id == Id).FirstOrDefault();

                if (Id != null)
                {
                    return BadRequest("Grupa nie istnieje");

                }
                else
                {
                    group = GroupViewModel.ToVM(checkIfExist);

                }

                return Ok(group);
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

            return new String(code);
        }


        //Usuwanie grupy - tylko dla createdbyid
        public IActionResult DeleteGroup(Guid Id)
        {
            try
            {
                GroupViewModel group = new GroupViewModel();
                var userId = _userManager.GetUserId(User);

                var checkIfExist = _context.Groups.Where(x => x.Id == Id).FirstOrDefault();

                if (Id != null)
                {
                    return BadRequest("Grupa nie istnieje");

                }
                else
                {
                    if(checkIfExist != null && checkIfExist.CreatedById.ToString() == userId)
                    {
                        var usersInGroups = _context.UsersInGroups.Where(x=>x.GroupId == Id).ToList();
                        
                        _context.UsersInGroups.RemoveRange(usersInGroups);
                        _context.SaveChanges();

                        _context.Groups.Remove(checkIfExist);
                        _context.SaveChanges();

                    }
                    else
                    {
                        return BadRequest("Grupę może usunąć tylko właściciel");
                    }

                }

                return Ok("Grupa usunięta");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
