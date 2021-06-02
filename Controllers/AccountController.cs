using AppointmentScheduling.Models;
using AppointmentScheduling.Models.ViewModels;
using AppointmentScheduling.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _db;
        UserManager<ApplicationUser> _userManager; // resposible for user control
        SignInManager<ApplicationUser> _signInManager; // resposible user signin
        RoleManager<IdentityRole> _roleManager; // reposible for roles

        public AccountController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,RoleManager<IdentityRole> roleManager )
        {
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        public IActionResult Login()
        {
            return View();
        }

        // login post action
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false); // will return if login was successful for user and password
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.Email); // this if for storing sesion user name
                    HttpContext.Session.SetString("ssuserName", user.Name); // session storage user name // for custom implementation write extension methods
                    //var userName = HttpContext.Session.GetString("ssuserName"); // retrieve session value in controller // retrieving in Appointment index view 
                    return RedirectToAction("Index", "Appointment");
                }
                // if login unsuccesful
                ModelState.AddModelError("", "Invalid login attempt");
            }
            return View(model);
        }


        // Get Action for register
        public async Task<IActionResult> Register()
        {
            
            return View();
        }

        //Post action for register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model) //rgister page uses RegisterViewModel
        {
            // also implement server side validaion
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    // populate all of the properties
                    UserName = model.Email,
                    Email = model.Email,
                    Name = model.Name,

                };

                // create user in database

                var result = await _userManager.CreateAsync(user, model.Password); // using await must make async at top register method
                if (result.Succeeded) // check if registration succeeded
                {
                    //assign user role if registaration successful - user

                    await _userManager.AddToRoleAsync(user, model.RoleName);
                    if (!User.IsInRole(Helper.Admin))
                    {
                        // automatically sing in new registered user if not admin user
                        await _signInManager.SignInAsync(user, isPersistent: false);

                    }
                    else
                    {
                        // added for new admin account created notification
                        TempData["newAdminSignUp"] = user.Name;
                    }

                    
                    return RedirectToAction("Index", "Appointment"); // successful redirect to  action : Index of Home Controller
                }

                foreach (var error in result.Errors) // display exact error message like if email already used to register
                {
                    ModelState.AddModelError("", error.Description);
                }

            }

            return View(model);
        }
        //post action - logoff  functionality
        [HttpPost]
        public async Task<IActionResult> LogOff()
        {

            await _signInManager.SignOutAsync();
            // redirect now after logoff

            return RedirectToAction("Login", "Account");

        }
    }
}
