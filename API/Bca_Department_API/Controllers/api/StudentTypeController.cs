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
    [RoutePrefix("api/StudentType")]
    public class StudentTypeController : ApiController
    {


        [HttpPost]
        [Route("StudentTypeList")]
        public ExpandoObject StudentTypeList(StudentType model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.StudentTypes
                           where (model.StudentTypeId == d1.StudentTypeId || model.StudentTypeId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.StudentTypeName
                           select new
                           {
                               d1.StudentTypeId,
                               d1.StudentTypeName,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                response.StudentTypeList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveStudentType")]
        public ExpandoObject SaveStudentType(StudentType model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                StudentType StudentType = null;
                if (model.StudentTypeId > 0)
                {
                    StudentType = dataContext.StudentTypes.Where(x => x.StudentTypeId == model.StudentTypeId).First();
                    StudentType.UpdatedBy = model.UpdatedBy;
                    StudentType.UpdatedDate = DateTime.Now;
                }
                else
                {
                    StudentType = new StudentType();
                    StudentType.CreatedBy = model.UpdatedBy;
                    StudentType.CreatedDate = DateTime.Now;
                }
                StudentType.StudentTypeName = model.StudentTypeName;
                StudentType.Status = model.Status;

                if (StudentType.StudentTypeId == 0)
                    dataContext.StudentTypes.InsertOnSubmit(StudentType);
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
        [Route("deleteStudentType")]
        public ExpandoObject DeleteStudentType(StudentType model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var StudentType = dataContext.StudentTypes.Where(x => x.StudentTypeId == model.StudentTypeId).First();
                dataContext.StudentTypes.DeleteOnSubmit(StudentType);
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
