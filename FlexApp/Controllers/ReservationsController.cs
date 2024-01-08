using FlexApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FlexApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private IConfiguration _configuration;
        private DatabaseContext _context;

        public ReservationsController(
            IConfiguration configuration,
            DatabaseContext context) 
        {
            _configuration = configuration;
            _context = context;
        }

        //User którego jest grupa moze tworzyc rezerwacje

        //Rezerwacja - powod, opis, data od(godzina), data do(godzina)

        //lista rezerwacji dla pokoju - data od(godzina), data do(godzina), kto, powod, opis // od dzisiejszego do kolejnych






    }
}
