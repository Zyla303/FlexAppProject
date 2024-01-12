using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace FlexApp.Models
{
    public class UsersInGroups
    {

        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public bool ConfirmParticipation { get; set; }

    }
}