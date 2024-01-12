using Microsoft.AspNetCore.Identity;
using System;

namespace FlexApp.Models
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class IdentityRole : IdentityRole<Guid>
    {
    }
}
