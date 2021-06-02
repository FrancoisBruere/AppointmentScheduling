using AppointmentScheduling.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Services
{
    public interface IAppointmentService
    {
        public List<DoctorVM> GetDoctorList(); //Get list of doctors from VM called GetDoctorList
        public List<PatientVM> GetPatientList();


        public Task<int> AddUpdate(AppointmentVM model);

        public List<AppointmentVM> DoctorsEventsByID(string doctorId); // get all appointments by doctor
        public List<AppointmentVM> PatientsEventsByID(string patientId); // get all appointments patients

        public AppointmentVM GetById(int id); // getting infor for appointment added on calendar

        public Task<int> Delete(int id); // method for deleting appointment
        public Task<int> ConfirmEvent(int id); // confirming appointment
    }
}
