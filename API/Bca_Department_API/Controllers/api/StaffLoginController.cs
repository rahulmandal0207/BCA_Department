using Bca_Department_classes;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Bca_Department_API.Controllers.api
{
    [RoutePrefix("api/StaffLogin")]

    public class StaffLoginController : ApiController
    {

        [HttpPost]
        [Route("StaffLoginList")]
        public ExpandoObject StaffLoginList(StaffLogin model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.StaffLogins
                           where (model.StaffLoginId == d1.StaffLoginId || model.StaffLoginId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.UserName
                           join d2 in dataContext.Staffs on d1.StaffId equals d2.StaffId
                           select new
                           {
                               d1.StaffLoginId,
                               d1.StaffId,
                               d2.StaffName,
                               d1.UserName,
                               d1.LoginPassword,
                               d1.UpdatedBy,
                               d1.UpdatedDate,
                               d1.CreatedBy,
                               d1.CreatedDate,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                ResponseMessage.StaffLoginList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("saveStaffLogin")]
        public ExpandoObject SaveStaffLogin(StaffLogin model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                StaffLogin StaffLogin = null;

                if (model.StaffLoginId > 0)
                {
                    StaffLogin = dataContext.StaffLogins.Where(x => x.StaffLoginId == model.StaffLoginId).First();
                    StaffLogin.UpdatedBy = model.UpdatedBy;
                    StaffLogin.UpdatedDate = DateTime.Now;
                }
                else
                {
                    StaffLogin = new StaffLogin();
                    StaffLogin.CreatedBy = model.CreatedBy;
                    StaffLogin.CreatedDate = DateTime.Now;
                }

                StaffLogin.StaffId = model.StaffId;
                StaffLogin.UserName = model.UserName;
                StaffLogin.LoginPassword = model.LoginPassword;

                StaffLogin.Status = model.Status;

                if (StaffLogin.StaffLoginId == 0)
                    dataContext.StaffLogins.InsertOnSubmit(StaffLogin);
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
        [Route("deleteStaffLogin")]
        public ExpandoObject DeleteStaffLogin(StaffLogin model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var StaffLogin = dataContext.StaffLogins.Where(x => x.StaffLoginId == model.StaffLoginId).First();
                dataContext.StaffLogins.DeleteOnSubmit(StaffLogin);
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
        [Route("StaffLogin")]
        public ExpandoObject StaffLogin(StaffLogin model)
        {
            dynamic response = new ExpandoObject();
            Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
            LoginLog loginLog = new LoginLog();
            try
            {
                loginLog.IPAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                if (HttpContext.Current.Request.Browser.IsMobileDevice)
                    loginLog.LoginDevice = "Mobile";
                else
                    loginLog.LoginDevice = "Computer";
                if (HttpContext.Current.Request.UrlReferrer != null)
                    loginLog.ReferrerUrl = HttpContext.Current.Request.UrlReferrer.ToString();
                else
                    loginLog.ReferrerUrl = "";


                HttpBrowserCapabilities bcr = HttpContext.Current.Request.Browser;
                loginLog.UserName = model.UserName;
                loginLog.LoginPassword = (model.LoginPassword);
                //loginLog.LoginPassword = Password;

                loginLog.ClientBrowser = bcr.Browser;
                loginLog.LoginTime = DateTime.Now;
                loginLog.LastUpdatedOn = DateTime.Now;
                loginLog.LoginResult = (byte)LoginResult.Error;

                int countStaffLogin = (from e1 in dataContext.StaffLogins
                                       where (e1.UserName == model.UserName)
                                       select e1).Count();
                if (countStaffLogin <= 0)
                {
                    loginLog.LoginResult = (byte)LoginResult.WrongUserName;
                    throw new Exception("Invalid User Id or Password");
                }
                var employeeLogin = (from e1 in dataContext.StaffLogins
                                     where (e1.UserName == model.UserName)
                                     select e1).First();

                if (employeeLogin.Status == (byte)Status.Inactive)
                {
                    loginLog.LoginResult = (byte)LoginResult.AccountNotActive;
                    throw new Exception("Invalid User Id or Password");
                }
                if (employeeLogin.LoginPassword != model.LoginPassword)
                {
                    loginLog.LoginResult = (byte)LoginResult.WrongPassword;
                    throw new Exception("Invalid User Id or Password");
                }

                loginLog.LoginResult = (byte)LoginResult.Successful;

                response.UserDetail = (from d1 in dataContext.StaffLogins
                                       where d1.StaffLoginId == employeeLogin.StaffLoginId
                                       join d2 in dataContext.Staffs on d1.StaffId equals d2.StaffId
                                       select new
                                       {
                                           d1.StaffLoginId,
                                           d1.StaffId,
                                           d2.StaffName,
                                           d1.UserName,
                                           d1.LoginPassword,
                                           d1.UpdatedBy,
                                           d1.UpdatedDate,
                                           d1.CreatedBy,
                                           d1.CreatedDate,
                                           d1.Status,
                                           StatusName = Enum.GetName(typeof(Status), d1.Status),
                                       }).First();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                dataContext.LoginLogs.InsertOnSubmit(loginLog);
                dataContext.SubmitChanges();
                response.Message = ex.Message;
            }
            return response;
        }
    }
}
