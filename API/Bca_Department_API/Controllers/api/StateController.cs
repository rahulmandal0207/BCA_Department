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
    [RoutePrefix("api/State")]
    public class StateController : ApiController
    {

        [HttpPost]
        [Route("StateList")]
        public ExpandoObject StateList(State model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.States
                           where (model.StateId == d1.StateId || model.StateId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.StateName
                           select new
                           {
                               d1.StateId,
                               d1.StateName,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                response.StateList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveState")]
        public ExpandoObject SaveState(State model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                State State = null;
                if (model.StateId > 0)
                {
                    State = dataContext.States.Where(x => x.StateId == model.StateId).First();
                    State.UpdatedBy = model.UpdatedBy;
                    State.UpdatedDate = DateTime.Now;
                }
                else
                {
                    State = new State();
                    State.CreatedBy = model.UpdatedBy;
                    State.CreatedDate = DateTime.Now;
                }
                State.StateName = model.StateName;
                State.Status = model.Status;

                if (State.StateId == 0)
                    dataContext.States.InsertOnSubmit(State);
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
        [Route("deleteState")]
        public ExpandoObject DeleteState(State model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var State = dataContext.States.Where(x => x.StateId == model.StateId).First();
                dataContext.States.DeleteOnSubmit(State);
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
