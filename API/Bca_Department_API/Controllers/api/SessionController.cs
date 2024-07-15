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
    [RoutePrefix("api/Session")]
    public class SessionController : ApiController
    {


        [HttpPost]
        [Route("SessionList")]
        public ExpandoObject SessionList(Session model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Sessions
                           where (model.SessionId == d1.SessionId || model.SessionId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.SessionName
                           select new
                           {
                               d1.SessionId,
                               d1.SessionName,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                response.SessionList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveSession")]
        public ExpandoObject SaveSession(Session model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Session Session = null;
                if (model.SessionId > 0)
                {
                    Session = dataContext.Sessions.Where(x => x.SessionId == model.SessionId).First();
                    Session.UpdatedBy = model.UpdatedBy;
                    Session.UpdatedDate = DateTime.Now;
                }
                else
                {
                    Session = new Session();
                    Session.CreatedBy = model.UpdatedBy;
                    Session.CreatedDate = DateTime.Now;
                }
                Session.SessionName = model.SessionName;
                Session.Status = model.Status;

                if (Session.SessionId == 0)
                    dataContext.Sessions.InsertOnSubmit(Session);
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
        [Route("deleteSession")]
        public ExpandoObject DeleteSession(Session model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Session = dataContext.Sessions.Where(x => x.SessionId == model.SessionId).First();
                dataContext.Sessions.DeleteOnSubmit(Session);
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
    }
}
