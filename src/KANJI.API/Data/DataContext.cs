using KANJI.Models;
using Microsoft.EntityFrameworkCore;

namespace KANJI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            //builder.Entity<User>().HasIndex(e => e.Username).IsUnique();
            //builder.UseSerialColumns();
            base.OnModelCreating(builder);
        }
    }
}
