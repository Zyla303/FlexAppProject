using FlexApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FlexApp
{
    public class DatabaseContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public DatabaseContext( DbContextOptions<DatabaseContext> options ) : base( options )
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<UsersInGroups> UsersInGroups { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Definicja klucza z�o�onego dla UsersInGroups
            modelBuilder.Entity<UsersInGroups>()
                .HasKey(uig => new { uig.UserId, uig.GroupId });
        }
    }
}
