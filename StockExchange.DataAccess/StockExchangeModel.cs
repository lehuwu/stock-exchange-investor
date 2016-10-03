using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using StockExchange.DataAccess.Models;

namespace StockExchange.DataAccess
{
    using System.Data.Entity;

    public sealed class StockExchangeModel : DbContext
    {
        public StockExchangeModel()
            : base("name=StockExchangeModel")
        {
        }

        public IDbSet<Company> Companies { get; set; }

        public IDbSet<Price> Prices { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>()
                .Property(e => e.Code)
                .IsFixedLength()
                .IsUnicode(false)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new IndexAttribute()));

            modelBuilder.Entity<Company>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<Company>()
                .HasMany(e => e.Prices)
                .WithRequired(e => e.Company)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Price>()
                .Property(e => e.OpenPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Price>()
                .Property(e => e.ClosePrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Price>()
                .Property(e => e.HighPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Price>()
                .Property(e => e.LowPrice)
                .HasPrecision(18, 2);
        }
    }
}