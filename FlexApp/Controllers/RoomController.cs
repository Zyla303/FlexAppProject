using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FlexApp.Models;
using System;
using FlexApp.ViewModels;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    public class RoomController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public RoomController(
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

        public IActionResult Index()
        {
            return Ok();
        }

        [HttpPost("CreateRoom")] // Działa
        [Authorize]
        public IActionResult CreateRoom(Guid GroupId, string Number, string Name)
        {
            try
            {
                // Walidacja danych wejściowych
                if (string.IsNullOrWhiteSpace(Number) || string.IsNullOrWhiteSpace(Name))
                {
                    return BadRequest("Room number and name cannot be empty.");
                }

                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return Unauthorized("User not logged in.");
                }

                // Sprawdzenie, czy użytkownik należy do grupy
                var isUserInGroup = _context.UsersInGroups
                                            .Any(x => x.UserId.ToString() == userId && x.GroupId == GroupId);
                if (!isUserInGroup)
                {
                    return BadRequest("User is not a member of the specified group.");
                }

                // Sprawdzenie, czy pokój już istnieje
                var ifRoomExist = _context.Rooms.Any(x => x.Number == Number);
                if (ifRoomExist)
                {
                    return BadRequest("A room with this number already exists.");
                }

                // Utworzenie i dodanie nowego pokoju
                var room = new Room
                {
                    GroupId = GroupId,
                    Number = Number,
                    Name = Name
                };

                _context.Rooms.Add(room);
                _context.SaveChanges();

                return Ok("Room successfully created.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Usuń pokój z grupy
        [HttpDelete("RemoveRoom")]
        [Authorize]
        public IActionResult RemoveRoom(Guid RoomId)
        {
            try
            {
                var room = _context.Rooms.FirstOrDefault(x => x.Id == RoomId);
                if (room == null)
                {
                    return NotFound("Room not found.");
                }

                var userId = _userManager.GetUserId(User);
                // Sprawdź, czy użytkownik należy do grupy, do której należy pokój
                var isUserInGroup = _context.UsersInGroups
                                            .Any(x => x.UserId.ToString() == userId && x.GroupId == room.GroupId);
                if (!isUserInGroup)
                {
                    return Unauthorized("You do not have permission to remove this room.");
                }

                _context.Rooms.Remove(room);
                _context.SaveChanges();

                return Ok("Room successfully removed.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Lista pokoi
        [HttpGet("ListOfRooms")] // Działa
        [Authorize]
        public IActionResult ListOfRooms(Guid GroupId)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return Unauthorized("User not logged in.");
                }

                // Sprawdzenie, czy użytkownik należy do grupy
                var isUserInGroup = _context.UsersInGroups
                                            .Any(x => x.UserId.ToString() == userId && x.GroupId == GroupId);
                if (!isUserInGroup)
                {
                    return BadRequest("User is not a member of the specified group.");
                }

                // Pobranie pokojów z bazy danych i konwersja ich na RoomViewModel
                var listOfRooms = _context.Rooms
                                          .Where(x => x.GroupId == GroupId)
                                          .Select(x => RoomViewModel.ToVM(x))
                                          .ToList();

                return Ok(listOfRooms);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
