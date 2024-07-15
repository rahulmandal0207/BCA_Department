using Bca_Department_classes;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Bca_Department_API.Controllers.api
{
    [RoutePrefix("api/DptStaff")]
    public class DptStaffController : ApiController
    {

        [HttpPost]
        [Route("DptStaffList")]
        public ExpandoObject StaffList(DptStaff model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.DptStaffs
                           join d2 in dataContext.Designations on d1.DesignationId equals d2.DesignationId
                           where (model.StaffId == d1.StaffId || model.StaffId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.StaffOrder
                           select new
                           {
                               d1.StaffId,
                               d1.StaffName,
                               d1.StaffCode,
                               d1.StaffType,
                               d1.Email,
                               d1.DOB,
                               d1.Gender,
                               d1.FatherName,
                               d1.DesignationId,
                               d2.DesignationName,
                               d1.JoinDate,
                               d1.StaffPhoto,
                               d1.twitterLink,
                               d1.facebookLink,
                               d1.instaLink,
                               d1.linkedinLink,
                               d1.StaffOrder,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                               GenderName = Enum.GetName(typeof(Gender), d1.Gender),
                               StaffTypeName = Enum.GetName(typeof(StaffType), d1.StaffType),
                           };

                ResponseMessage.DptStaffList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("saveDptStaff")]
        public ExpandoObject SaveStaff(DptStaff model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                DptStaff Staff = null;
                if (model.StaffId > 0)
                {
                    Staff = dataContext.DptStaffs.Where(x => x.StaffId == model.StaffId).First();
                    Staff.UpdatedBy = model.UpdatedBy;
                    Staff.UpdatedDate = DateTime.Now;
                }
                else
                {
                    Staff = new DptStaff();
                    Staff.CreatedBy = model.UpdatedBy;
                    Staff.CreatedDate = DateTime.Now;
                    Staff.StaffCode = AppData.GenerateDptStaffCode(dataContext);
                }
                Staff.StaffName = model.StaffName;
                Staff.StaffType = model.StaffType;
                Staff.Email = model.Email;
                Staff.DOB = model.DOB;
                Staff.Gender = model.Gender;
                Staff.FatherName = model.FatherName;
                Staff.DesignationId = model.DesignationId;
                Staff.JoinDate = model.JoinDate;
                Staff.twitterLink = model.twitterLink;
                Staff.facebookLink = model.facebookLink;
                Staff.instaLink = model.instaLink;
                Staff.linkedinLink = model.linkedinLink;
                Staff.StaffOrder = model.StaffOrder;
                Staff.StaffPhoto = model.StaffPhoto;
                Staff.Status = model.Status;

                if (Staff.StaffId == 0)
                    dataContext.DptStaffs.InsertOnSubmit(Staff);
                dataContext.SubmitChanges();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("IX"))
                    ResponseMessage.Message = "This record is already exist";
                else
                    ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("deleteDptStaff")]
        public ExpandoObject DeleteStaff(DptStaff model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Staff = dataContext.DptStaffs.Where(x => x.StaffId == model.StaffId).First();


                string path = HttpContext.Current.Server.MapPath(Staff.StaffPhoto);

                if (File.Exists(path))
                    File.Delete(path);


                dataContext.DptStaffs.DeleteOnSubmit(Staff);
                dataContext.SubmitChanges();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("FK"))
                    ResponseMessage.Message = "This record is in use.so can't delete.";
                else
                    ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("saveDptStaffDp")]
        public ExpandoObject SaveDptStaffDp()
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                int StaffId = Convert.ToInt32(HttpContext.Current.Request.Params["StaffId"]);

                DptStaff staff = dataContext.DptStaffs.Where(x => x.StaffId == StaffId).First();

                string previousPhoto = HttpContext.Current.Server.MapPath(staff.StaffPhoto);

                if (File.Exists(previousPhoto))
                    File.Delete(previousPhoto);


                var photo = HttpContext.Current.Request.Files["StaffPhoto"];
                string path = HttpContext.Current.Request.MapPath("/Images/DptStaff/dp/");

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string fileName = Guid.NewGuid() + ".jpg";
                photo.SaveAs(path + fileName);
                staff.StaffPhoto = "/Images/DptStaff/dp/" + fileName;

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
