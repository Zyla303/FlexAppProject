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

        [Display(Name = "Nazwa")]
        public string Name { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Hasło")]
        public string Password { get; set; }

        public string EmailConfirmed { get; set; }
        public string PasswordConfirmed { get; set; }



        public static UserViewModel ToVM(User model)
        {
            if (model == null) return null;
            return new UserViewModel()
            {
                Id = model.Id,
                Name = model.Name,
                Email = model.Email,
                Password = model.Password,
                EmailConfirmed = model.EmailConfirmed,
                PasswordConfirmed = model.PasswordConfirmed,

            };
        }

        public User ToModel(User model)
        {
            model.Id = Id;
            model.Name = Name;
            model.Email = Email;
            model.Password = Password;
            model.EmailConfirmed = EmailConfirmed;
            model.PasswordConfirmed = PasswordConfirmed;

            return model;
        }
    }
}
