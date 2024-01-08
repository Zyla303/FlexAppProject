using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FlexApp.Models;
using System;
using FlexApp.ViewModels;
using Newtonsoft.Json;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    public class RoomController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;

        public RoomController(IConfiguration configuration, DatabaseContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        //Dodaj pokój
        public IActionResult CreateRoom(Guid GroupId, string Number, string Name)
        {
            try
            {
                Room room = new Room();
                var ifRoomExist = _context.Rooms.Where(x=>x.Number == Number).Any();

                if(ifRoomExist)
                {
                    BadRequest("Pokój istnieje");
                }
                else
                {
                    room.GroupId = GroupId;
                    room.Number = Number;
                    room.Name = Name;

                    _context.Rooms.Add(room);
                    _context.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Usuń pokój z grupy
        public IActionResult RemoveRoom(Guid RoomId)
        {
            try
            {
                var room = _context.Rooms.Where(x=>x.Id == RoomId).FirstOrDefault();

                if(room != null)
                {
                    _context.Rooms.Remove(room);
                    _context.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Lista pokoi
        public IActionResult ListOfRooms(Guid GroupId)
        {
            try
            {
                List<RoomViewModel> listOfRooms = new List<RoomViewModel>();

                var roomsFromDB = _context.Rooms.Where(x => x.GroupId == GroupId).ToList();

                listOfRooms = roomsFromDB.Select(x => RoomViewModel.ToVM(x)).ToList();

                return Ok(listOfRooms);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}
