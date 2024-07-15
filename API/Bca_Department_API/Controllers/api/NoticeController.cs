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
    [RoutePrefix("api/Notice")]

    public class NoticeController : ApiController
    {
        [HttpPost]
        [Route("NoticeList")]
        public ExpandoObject GetNoticeList()
        {
            dynamic response = new ExpandoObject();

            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Notices
                           select new
                           {
                               d1.NoticeId,
                               d1.NoticeTitle,
                               d1.NoticePath,
                               d1.ShowNotice,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status)
                           };

                response.NoticeList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
            }

            return response;
        }

        [HttpPost]
        [Route("saveNotice")]
        public ExpandoObject SaveNotice()
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Notice notice = null;

                int NoticeId = Convert.ToInt32(HttpContext.Current.Request.Params["NoticeId"]);

                if (NoticeId > 0)
                {
                    notice = dataContext.Notices.Where(x => x.NoticeId == NoticeId).First();
                    notice.UpdatedBy = Convert.ToInt32(HttpContext.Current.Request.Params["StaffLoginId"]);
                    notice.UpdatedDate = DateTime.Now;
                }
                else
                {
                    notice = new Notice();
                    notice.CreatedBy = Convert.ToInt32(HttpContext.Current.Request.Params["StaffLoginId"]);
                    notice.CreatedDate = DateTime.Now;
                }


                var noticeFile = HttpContext.Current.Request.Files["Notice"];
                var path = HttpContext.Current.Request.MapPath("/Notice/");

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                var fileName = Guid.NewGuid() + ".pdf";


                notice.NoticeTitle = HttpContext.Current.Request.Params["NoticeTitle"];
                notice.Status = Convert.ToByte(HttpContext.Current.Request.Params["Status"]);

                noticeFile.SaveAs(path + fileName);
                notice.NoticePath = "/Notice/" + fileName;

                if (NoticeId == 0)
                    dataContext.Notices.InsertOnSubmit(notice);
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
        [Route("deleteNotice")]
        public ExpandoObject DeleteNotice(Notice model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Notice = dataContext.Notices.Where(x => x.NoticeId == model.NoticeId).First();


                string path = HttpContext.Current.Server.MapPath(Notice.NoticePath);

                if (File.Exists(path))
                    File.Delete(path);

                dataContext.Notices.DeleteOnSubmit(Notice);
                dataContext.SubmitChanges();
                ResponseMessage.Message = ConstantData.SuccessMessage;


            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("FK"))
                    ResponseMessage.Message = "This record is in use. so can't delete.";
                else
                    ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }



        [HttpPost]
        [Route("UpdateStatus")]
        public ExpandoObject UpdateStatus(Notice model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Notice notice = dataContext.Notices.Where(x => x.NoticeId == model.NoticeId).First();

                notice.Status = model.Status;

                dataContext.SubmitChanges();

                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
            }

            return response;
        }

    }
}
