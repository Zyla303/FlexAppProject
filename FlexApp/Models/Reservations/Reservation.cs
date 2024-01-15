namespace FlexApp.Models
{
    public class Reservation
    {
        public Guid Id { get; set; }

        public Guid? RoomId { get; set; }
        public virtual Room Room { get; set; }

        public Guid CreatedById { get; set; }
        public virtual User CreatedBy { get; set; }

        public string Reason { get; set; }
        public string Description { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        
    }
}