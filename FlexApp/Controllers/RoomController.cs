using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FlexApp.Models;
using System;
using FlexApp.ViewModels;

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

        //Usuń pokój z grupy


    }
}
