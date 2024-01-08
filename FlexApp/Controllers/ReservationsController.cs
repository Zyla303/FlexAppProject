using FlexApp.Models;
using FlexApp.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FlexApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public ReservationsController(
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

        //User którego jest grupa moze tworzyc rezerwacje
        //Rezerwacja - powod, opis, data od(godzina), data do(godzina)

        public IActionResult CreateReservation([FromBody] object o)
        {
            try
            {
                ReservationViewModel reservation = JsonConvert.DeserializeObject<ReservationViewModel>(o.ToString());

                var userId = _userManager.GetUserId(User);
                if (Guid.TryParse(userId, out var userGuid))
                {
                    reservation.CreatedById = userGuid;
                }
                
                var isRoomFree = _context.Reservations.Where(x=>x.RoomId == reservation.RoomId && x.DateFrom > reservation.DateFrom && x.DateTo <= reservation.DateTo);

                if (isRoomFree.Any())
                {
                    return BadRequest("Pokój jest zajęty w podanej dacie");
                }
                else
                {

                    Reservation reservationToDB = new Reservation();
                    _context.Reservations.Add(reservation.ToModel(reservationToDB));

                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //lista rezerwacji dla pokoju - data od(godzina), data do(godzina), kto, powod, opis // od dzisiejszego do kolejnych
        public IActionResult ListOfReservations(Guid RoomId)
        {
            try
            {
                List<ReservationViewModel> listOfReservations = new List<ReservationViewModel>();

                var reservationsFromDB = _context.Reservations.Where(x => x.RoomId == RoomId).OrderByDescending(x => x.DateFrom).Take(20).ToList();

                listOfReservations = reservationsFromDB.Select(x => ReservationViewModel.ToVM(x)).ToList();

                return Ok(listOfReservations);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





    }
}
