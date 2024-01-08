using FlexApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FlexApp
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<UsersInGroups> UsersInGroups { get; set; }
        public DbSet <Room> Rooms { get; set; }
        public DbSet <Reservation> Reservations { get; set; }


        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

    }
}
