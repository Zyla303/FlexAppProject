using FlexApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlexApp.ViewModels
{
    public class GroupViewModel
    {
        public GroupViewModel()
        {
        }

        public Guid Id { get; set; }

        [Display(Name = "Nazwa")]
        public string Name { get; set; }

        public Guid CreatedById { get; set; }

        [Display(Name = "Stworzone przez")]
        public virtual UserViewModel CreatedBy { get; set; }

        public string InvitationCode { get; set; }




        public static GroupViewModel ToVM(Group model)
        {
            if (model == null) return null;
            return new GroupViewModel()
            {
                Id = model.Id,
                Name = model.Name,
                CreatedById = model.CreatedById,
                //CreatedBy = model.CreatedBy,
                InvitationCode = model.InvitationCode
            };
        }

        public Group ToModel(Group model)
        {
            model.Id = Id;
            model.Name = Name;
            model.CreatedById = CreatedById;
            //model.CreatedBy = CreatedBy;
            model.InvitationCode = InvitationCode;

            return model;
        }
    }
}
