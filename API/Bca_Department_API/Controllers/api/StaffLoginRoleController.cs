using Bca_Department_classes;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Bca_Department_API.Controllers.api
{
    [RoutePrefix("api/StaffLoginRole")]

    public class StaffLoginRoleController : ApiController
    {
        [HttpPost]
        [Route("StaffLoginRoleList")]
        public ExpandoObject StaffLoginRoleList(StaffLoginRole model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.StaffLoginRoles
                               //where (model.StaffLoginRoleId == d1.StaffLoginRoleId || model.StaffLoginRoleId == 0)
                           orderby d1.StaffLoginId
                           join d2 in dataContext.StaffLogins on d1.StaffLoginId equals d2.StaffLoginId
                           join d3 in dataContext.Roles on d1.RoleId equals d3.RoleId
                           select new
                           {
                               d1.StaffLoginRoleId,
                               d2.StaffLoginId,
                               d2.UserName,
                               d3.RoleId,
                               d3.RoleTitle
                           };

                ResponseMessage.StaffLoginRoleList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("saveStaffLoginRole")]
        public ExpandoObject SaveStaffLoginRole(StaffLoginRole model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                StaffLoginRole StaffLoginRole = null;
                if (model.StaffLoginRoleId > 0)
                {
                    StaffLoginRole = dataContext.StaffLoginRoles.Where(x => x.StaffLoginRoleId == model.StaffLoginRoleId).First();
                    StaffLoginRole.UpdatedBy = model.UpdatedBy;
                    StaffLoginRole.UpdatedDate = DateTime.Now;
                }
                else
                    StaffLoginRole = new StaffLoginRole();

                StaffLoginRole.StaffLoginId = model.StaffLoginId;
                StaffLoginRole.RoleId = model.RoleId;

                if (StaffLoginRole.StaffLoginRoleId == 0)
                    dataContext.StaffLoginRoles.InsertOnSubmit(StaffLoginRole);
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
        [Route("deleteStaffLoginRole")]
        public ExpandoObject DeleteStaffLoginRole(StaffLoginRole model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var StaffLoginRole = dataContext.StaffLoginRoles.Where(x => x.StaffLoginRoleId == model.StaffLoginRoleId).First();
                dataContext.StaffLoginRoles.DeleteOnSubmit(StaffLoginRole);
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
    }
}
