using Bca_Department_classes;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Web;
using System.Web.Http;

namespace Bca_Department_API.Controllers.api
{
    [RoutePrefix("api/Student")]
    public class StudentController : ApiController
    {


        [HttpPost]
        [Route("StudentList")]
        public ExpandoObject StudentList(Student model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Students
                           join d2 in dataContext.StudentTypes on d1.StudentTypeId equals d2.StudentTypeId
                           join d3 in dataContext.States on d1.CorrespondenceStateId equals d3.StateId
                           join d4 in dataContext.States on d1.PermanentStateId equals d4.StateId
                           join d5 in dataContext.Sessions on d1.SessionId equals d5.SessionId
                           join d6 in dataContext.Cities on d1.CorrespondenceCityId equals d6.CityId
                           join d7 in dataContext.Cities on d1.PermanentCityId equals d7.CityId
                           where (d1.SessionId == model.SessionId)
                           orderby d1.StudentName
                           select new
                           {
                               d1.StudentId,
                               d1.StudentName,
                               d1.StudentTypeId,
                               d2.StudentTypeName,
                               d1.SessionId,
                               d5.SessionName,
                               d1.AdmissionNo,
                               d1.DOB,
                               d1.Gender,
                               d1.MobileNo,
                               d1.Email,
                               d1.AlternateMobileNo,
                               d1.AadhaarNo,
                               d1.ClassRoll,
                               d1.UniversityRoll,

                               d1.FatherName,
                               d1.FatherOccupation,
                               d1.MotherName,
                               d1.MotherOccupation,
                               d1.GuardianMobileNo,

                               d1.CorrespondenceAddress,
                               d1.CorrespondenceStateId,
                               CorrespondenceStateName = d3.StateName,
                               d1.CorrespondenceCityId,
                               CorrespondenceCityName = d6.CityName,
                               d1.CorrespondencePinCode,

                               d1.PermanentAddress,
                               d1.PermanentStateId,
                               PermanentStateName = d4.StateName,
                               d1.PermanentCityId,
                               PermanentCityName = d7.CityName,
                               d1.PermanentPinCode,

                               d1.Category,
                               d1.BloodGroup,
                               d1.Religion,

                               d1.StudentPhoto,
                               d1.Status,

                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                               GenderName = Enum.GetName(typeof(Gender), d1.Gender),
                               CategoryName = Enum.GetName(typeof(Category), d1.Category),
                               ReligionName = Enum.GetName(typeof(Religion), d1.Religion),
                               BloodGroupName = Enum.GetName(typeof(BloodGroup), d1.BloodGroup),
                           };

                response.StudentList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {

                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveStudent")]
        public ExpandoObject SaveStudent(Student model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Student Student = null;
                if (model.StudentId > 0)
                {
                    Student = dataContext.Students.Where(x => x.StudentId == model.StudentId).First();
                    Student.UpdatedBy = model.UpdatedBy;
                    Student.UpdatedDate = DateTime.Now;
                }
                else
                {
                    Student = new Student();
                    Student.CreatedBy = model.UpdatedBy;
                    Student.CreatedDate = DateTime.Now;
                }
                Student.ClassRoll = model.ClassRoll;
                Student.UniversityRoll = model.UniversityRoll;
                Student.StudentName = model.StudentName;
                Student.StudentTypeId = model.StudentTypeId;
                Student.SessionId = model.SessionId;
                Student.AdmissionNo = model.AdmissionNo;
                Student.DOB = model.DOB;
                Student.Gender = model.Gender;
                Student.FatherName = model.FatherName;
                Student.FatherOccupation = model.FatherOccupation;
                Student.MotherName = model.MotherName;
                Student.MotherOccupation = model.MotherOccupation;
                Student.GuardianMobileNo = model.GuardianMobileNo;
                Student.CorrespondenceAddress = model.CorrespondenceAddress;
                Student.CorrespondenceStateId = model.CorrespondenceStateId;
                Student.CorrespondenceCityId = model.CorrespondenceCityId;
                Student.CorrespondencePinCode = model.CorrespondencePinCode;
                Student.PermanentAddress = model.PermanentAddress;
                Student.PermanentStateId = model.PermanentStateId;
                Student.PermanentCityId = model.PermanentCityId;
                Student.PermanentPinCode = model.PermanentPinCode;
                Student.Category = model.Category;
                Student.BloodGroup = model.BloodGroup;
                Student.Religion = model.Religion;
                Student.MobileNo = model.MobileNo;
                Student.AlternateMobileNo = model.AlternateMobileNo;
                Student.Email = model.Email;
                Student.AadhaarNo = model.AadhaarNo;
                Student.StudentPhoto = model.StudentPhoto;
                Student.Status = model.Status;

                if (Student.StudentId == 0)
                    dataContext.Students.InsertOnSubmit(Student);
                dataContext.SubmitChanges();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("IX"))
                    response.Message = "This record is already exist";
                else
                    response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("deleteStudent")]
        public ExpandoObject DeleteStudent(Student model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Student = dataContext.Students.Where(x => x.StudentId == model.StudentId).First();
                dataContext.Students.DeleteOnSubmit(Student);
                dataContext.SubmitChanges();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("FK"))
                    response.Message = "This record is in use.so can't delete.";
                else
                    response.Message = ex.Message;
            }
            return response;
        }


        [HttpPost]
        [Route("saveStudentDp")]
        public ExpandoObject SaveStudentDp()
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                int StudentId = Convert.ToInt32(HttpContext.Current.Request.Params["StudentId"]);

                Student staff = dataContext.Students.Where(x => x.StudentId == StudentId).First();

                string previousPhoto = HttpContext.Current.Server.MapPath(staff.StudentPhoto);

                if (File.Exists(previousPhoto))
                    File.Delete(previousPhoto);


                var photo = HttpContext.Current.Request.Files["StaffPhoto"];
                string path = HttpContext.Current.Request.MapPath("/Images/Student/dp/");

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string fileName = Guid.NewGuid() + ".jpg";
                photo.SaveAs(path + fileName);
                staff.StudentPhoto = "/Images/Student/dp/" + fileName;

                dataContext.SubmitChanges();

                response.Message = ConstantData.SuccessMessage;

            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("IX"))
                    response.Message = "This record is already exist";
                else
                    response.Message = ex.Message;
            }

            return response;
        }
    }
}
