using FlexApp.Models;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace FlexApp.Controllers
{
    [Route("workflow/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public ReservationsController(
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

        //User którego jest grupa moze tworzyc rezerwacje
        //Rezerwacja - powod, opis, data od(godzina), data do(godzina)

        [HttpPost("CreateReservation")]
        [Authorize]
        public IActionResult CreateReservation([FromBody] ReservationViewModel reservationViewModel)
        {
            try
            {
                if (reservationViewModel == null || reservationViewModel.RoomId == null)
                {
                    return BadRequest("Invalid reservation data.");
                }

                var room = _context.Rooms.FirstOrDefault(x => x.Id == reservationViewModel.RoomId.Value);
                if (room == null)
                {
                    return NotFound("Room not found.");
                }

                var userId = _userManager.GetUserId(User);
                if (!Guid.TryParse(userId, out var userGuid))
                {
                    return Unauthorized("User not logged in.");
                }

                // Sprawdzenie, czy użytkownik należy do grupy powiązanej z pokojem
                var isUserInGroup = _context.UsersInGroups.Any(x => x.UserId == userGuid && x.GroupId == room.GroupId);
                if (!isUserInGroup)
                {
                    return BadRequest("User is not a member of the group associated with this room.");
                }

                // Sprawdzenie, czy termin rezerwacji jest dostępny
                var isRoomBooked = _context.Reservations.Any(x => x.RoomId == reservationViewModel.RoomId &&
                                                                  x.DateFrom < reservationViewModel.DateTo &&
                                                                  x.DateTo > reservationViewModel.DateFrom);
                if (isRoomBooked)
                {
                    return BadRequest("The room is already booked for the specified dates.");
                }

                // Utworzenie nowej rezerwacji
                var reservation = new Reservation
                {
                    RoomId = reservationViewModel.RoomId.Value,
                    CreatedById = userGuid,
                    DateFrom = reservationViewModel.DateFrom,
                    DateTo = reservationViewModel.DateTo,
                    Reason = reservationViewModel.Reason,
                    Description = reservationViewModel.Description
                };

                _context.Reservations.Add(reservation);
                _context.SaveChanges();

                return Ok(reservation.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //lista rezerwacji dla pokoju - data od(godzina), data do(godzina), kto, powod, opis // od dzisiejszego do kolejnych
        [HttpGet("ListOfReservations")]
        [Authorize]
        public IActionResult ListOfReservations(Guid RoomId)
        {
            try
            {
                var room = _context.Rooms.FirstOrDefault(r => r.Id == RoomId);
                if (room == null)
                {
                    return NotFound("Room not found.");
                }

                var currentDate = DateTime.Now;
                var reservationsFromDB = _context.Reservations
                                                 .Where(x => x.RoomId == RoomId && x.DateFrom >= currentDate)
                                                 .OrderByDescending(x => x.DateFrom)
                                                 .Take(20)
                                                 .ToList();

                var listOfReservations = reservationsFromDB.Select(x => ReservationViewModel.ToVM(x)).ToList();

                return Ok(listOfReservations);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("RemoveReservation")]
        [Authorize]
        public IActionResult RemoveReservation(Guid reservationId)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return Unauthorized("User not logged in.");
                }

                var reservation = _context.Reservations.FirstOrDefault(r => r.Id == reservationId);
                if (reservation == null)
                {
                    return NotFound("Reservation not found.");
                }

                if (!Guid.TryParse(userId, out var userGuid) || reservation.CreatedById != userGuid)
                {
                    return Unauthorized("You can only delete reservations you have created.");
                }

                _context.Reservations.Remove(reservation);
                _context.SaveChanges();

                return Ok("Reservation successfully removed.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
