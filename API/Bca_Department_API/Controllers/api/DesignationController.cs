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
    [RoutePrefix("api/Designation")]
    public class DesignationController : ApiController
    {

        [HttpPost]
        [Route("DesignationList")]
        public ExpandoObject DesignationList(Designation model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Designations
                           where (model.DesignationId == d1.DesignationId || model.DesignationId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.DesignationName
                           select new
                           {
                               d1.DesignationId,
                               d1.DesignationName,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                response.DesignationList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveDesignation")]
        public ExpandoObject SaveDesignation(Designation model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Designation Designation = null;
                if (model.DesignationId > 0)
                {
                    Designation = dataContext.Designations.Where(x => x.DesignationId == model.DesignationId).First();
                    Designation.UpdatedBy = model.UpdatedBy;
                    Designation.UpdatedDate = DateTime.Now;
                }
                else
                {
                    Designation = new Designation();
                    Designation.CreatedBy = model.UpdatedBy;
                    Designation.CreatedDate = DateTime.Now;
                }
                Designation.DesignationName = model.DesignationName;
                Designation.Status = model.Status;

                if (Designation.DesignationId == 0)
                    dataContext.Designations.InsertOnSubmit(Designation);
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
        [Route("deleteDesignation")]
        public ExpandoObject DeleteDesignation(Designation model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Designation = dataContext.Designations.Where(x => x.DesignationId == model.DesignationId).First();
                dataContext.Designations.DeleteOnSubmit(Designation);
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
