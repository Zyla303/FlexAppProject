using FlexApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FlexApp
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

    }
}
