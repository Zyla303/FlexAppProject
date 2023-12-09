using FlexApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlexApp.ViewModels
{
    public class UsersInGroupsViewModel
    {
        public UsersInGroupsViewModel()
        {
        }

        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public bool ConfirmParticipation { get; set; }




        public static UsersInGroupsViewModel ToVM(UsersInGroups model)
        {
            if (model == null) return null;
            return new UsersInGroupsViewModel()
            {
                UserId = model.UserId,
                GroupId = model.GroupId,
                ConfirmParticipation = model.ConfirmParticipation
            };
        }

        public UsersInGroups ToModel(UsersInGroups model)
        {
            model.UserId = UserId;
            model.GroupId = GroupId;
            model.ConfirmParticipation = ConfirmParticipation;

            return model;
        }
    }
}
