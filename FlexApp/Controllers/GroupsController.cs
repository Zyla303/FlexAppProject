using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FlexApp.Models;
using System;
using FlexApp.ViewModels;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    public class GroupsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;

        public GroupsController(IConfiguration configuration, DatabaseContext context)
        {
            _configuration = configuration;
            _context = context;
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
                var userId = User.FindFirst("sub")?.Value;

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



    }
}
