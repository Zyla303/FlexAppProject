using FlexApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlexApp.ViewModels
{
    public class RoomViewModel
    {
        public RoomViewModel()
        {
        }

        public Guid Id { get; set; }
        public Guid GroupId { get; set; }

        [Display(Description = "Numer")]
        public string Number { get; set; }

        [Display(Description = "Nazwa")]
        public string Name { get; set; }




        public static RoomViewModel ToVM(Room model)
        {
            if (model == null) return null;
            return new RoomViewModel()
            {
                Id = model.Id,
                GroupId = model.GroupId,
                Number = model.Number,
                Name = model.Name
            };
        }

        public Room ToModel(Room model)
        {
            model.Id = Id;
            model.GroupId = GroupId;
            model.Number = Number;
            model.Name = Name;

            return model;
        }
    }
}
