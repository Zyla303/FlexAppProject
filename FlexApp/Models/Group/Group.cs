namespace FlexApp.Models
{
    public class Group
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid CreatedById { get; set; }
        public virtual User CreatedBy { get; set; }
        public string InvitationCode { get; set; }
        
    }
}