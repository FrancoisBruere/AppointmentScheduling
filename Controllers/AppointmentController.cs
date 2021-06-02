using AppointmentScheduling.Services;
using AppointmentScheduling.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Controllers
{

    // Authorization at global level

    [Authorize] // stop unathorized users accessing appointment controller ie site functions global level
    public class AppointmentController : Controller
    {

        private readonly IAppointmentService _appointmentService; // ADD enable to use below getdoctorList Method

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
       

        public IActionResult Index()
        {
            ViewBag.DoctorList = _appointmentService.GetDoctorList(); // using viewbag
            ViewBag.PatientList = _appointmentService.GetPatientList(); // using viewbag
            ViewBag.Duration = Helper.GetTimeDropDown(); // using viewbag timeDropdown for calendar
            return View();
        }
    }
}
