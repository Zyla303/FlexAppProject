using FlexApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlexApp.ViewModels
{
    public class ReservationViewModel
    {
        public ReservationViewModel()
        {
        }

        public Guid Id { get; set; }

        public Guid? RoomId { get; set; }
        [Display(Name = "Pokój")]
        public virtual RoomViewModel Room { get; set; }

        public Guid CreatedById { get; set; }
        [Display(Name = "Stworzone przez")]
        public virtual UserViewModel CreatedBy { get; set; }

        [Display(Name = "Powód")]
        public string Reason { get; set; }

        [Display(Name = "Opis")]
        public string Description { get; set; }

        [Display(Name = "Data od")]
        public DateTime DateFrom { get; set; }

        [Display(Name = "Data do")]
        public DateTime DateTo { get; set; }

        public static ReservationViewModel ToVM(Reservation model)
        {
            if (model == null) return null;
            return new ReservationViewModel()
            {
                Id = model.Id,
                RoomId = model.RoomId,
                CreatedById = model.CreatedById,
                Reason = model.Reason,
                Description = model.Description,
                DateFrom = model.DateFrom,
                DateTo = model.DateTo
            };
        }

        public Reservation ToModel(Reservation model)
        {
            model.Id = Id;
            model.RoomId = RoomId;
            model.CreatedById = CreatedById;
            model.Reason = Reason;
            model.Description = Description;
            model.DateFrom = DateFrom;
            model.DateTo = DateTo;

            return model;
        }
    }
}
