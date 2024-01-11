using FlexApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FlexApp.ViewModels
{
    public class UserViewModel
    {
        public UserViewModel()
        {
        }

        public Guid Id { get; set; }

        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Display(Name = "Imie")]
        public string FirstName { get; set; }

        [Display(Name = "Nazwisko")]
        public string LastName { get; set; }

        [Display(Name = "Hasło")]
        public string Password { get; set; }

        public static UserViewModel ToVM(User model)
        {
            if (model == null) return null;
            return new UserViewModel()
            {
                Id = model.Id,
                UserName = model.UserName,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Password = model.Password,
            };
        }

        public User ToModel(User model)
        {
            model.Id = Id;
            model.UserName = UserName;
            model.FirstName = FirstName;
            model.LastName = LastName;
            model.Password = Password;
            return model;
        }
    }
}
