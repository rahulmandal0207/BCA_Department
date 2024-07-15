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
    [RoutePrefix("api/PageGroup")]
    public class PageGroupController : ApiController
    {

        [HttpPost]
        [Route("PageGroupList")]
        public ExpandoObject PageGroupList(PageGroup model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.PageGroups
                           where (model.PageGroupId == d1.PageGroupId || model.PageGroupId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.PageGroupName
                           select new
                           {
                               d1.PageGroupId,
                               d1.PageGroupName,
                               d1.Status,
                               d1.UpdatedBy,
                               d1.UpdatedDate,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                ResponseMessage.PageGroupList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("savePageGroup")]
        public ExpandoObject SavePageGroup(PageGroup model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                PageGroup PageGroup = null;
                if (model.PageGroupId > 0)
                {
                    PageGroup = dataContext.PageGroups.Where(x => x.PageGroupId == model.PageGroupId).First();
                    PageGroup.UpdatedBy = model.UpdatedBy;
                    PageGroup.UpdatedDate = DateTime.Now;
                }
                else
                    PageGroup = new PageGroup();
                PageGroup.PageGroupName = model.PageGroupName;
                PageGroup.Status = model.Status;

                if (PageGroup.PageGroupId == 0)
                    dataContext.PageGroups.InsertOnSubmit(PageGroup);
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
        [Route("deletePageGroup")]
        public ExpandoObject DeletePageGroup(PageGroup model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var PageGroup = dataContext.PageGroups.Where(x => x.PageGroupId == model.PageGroupId).First();
                dataContext.PageGroups.DeleteOnSubmit(PageGroup);
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
