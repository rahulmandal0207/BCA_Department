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
    [RoutePrefix("api/Page")]
    public class PageController : ApiController
    {

        [HttpPost]
        [Route("PageList")]
        public ExpandoObject PageList(Page model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Pages
                           where (model.PageId == d1.PageId || model.PageId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.PageName
                           join d2 in dataContext.PageGroups on d1.PageGroupId equals d2.PageGroupId
                           select new
                           {
                               d1.PageId,
                               d1.PageGroupId,
                               d2.PageGroupName,
                               d1.PageName,
                               d1.PageUrl,
                               d1.Status,
                               d1.UpdatedBy,
                               d1.UpdatedDate,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                ResponseMessage.PageList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }



        [HttpPost]
        [Route("savePage")]
        public ExpandoObject SavePage(Page model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Page Page = null;
                if (model.PageId > 0)
                {
                    Page = dataContext.Pages.Where(x => x.PageId == model.PageId).First();
                    Page.UpdatedBy = model.UpdatedBy;
                    Page.UpdatedDate = DateTime.Now;
                }
                else
                    Page = new Page();
                Page.PageGroupId = model.PageGroupId;
                Page.PageName = model.PageName;
                Page.PageUrl = model.PageUrl;

                Page.Status = model.Status;

                if (Page.PageId == 0)
                    dataContext.Pages.InsertOnSubmit(Page);
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
        [Route("deletePage")]
        public ExpandoObject DeletePage(Page model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Page = dataContext.Pages.Where(x => x.PageId == model.PageId).First();
                dataContext.Pages.DeleteOnSubmit(Page);
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
