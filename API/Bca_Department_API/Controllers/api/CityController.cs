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
    [RoutePrefix("api/City")]
    public class CityController : ApiController
    {

        [HttpPost]
        [Route("CityList")]
        public ExpandoObject CityList(City model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Cities
                           join d2 in dataContext.States on d1.StateId equals d2.StateId
                           where (model.CityId == d1.CityId || model.CityId == 0)
                           && (model.Status == d1.Status || model.Status == 0)
                           orderby d1.CityName
                           select new
                           {
                               d1.CityId,
                               d1.StateId,
                               d2.StateName,
                               d1.CityName,
                               d1.Status,
                               StatusName = Enum.GetName(typeof(Status), d1.Status),
                           };

                response.CityList = list.ToList();
                response.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("saveCity")]
        public ExpandoObject SaveCity(City model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                City City = null;
                if (model.CityId > 0)
                {
                    City = dataContext.Cities.Where(x => x.CityId == model.CityId).First();
                    City.UpdatedBy = model.UpdatedBy;
                    City.UpdatedDate = DateTime.Now;
                }
                else
                {
                    City = new City();
                    City.CreatedBy = model.UpdatedBy;
                    City.CreatedDate = DateTime.Now;
                }
                City.StateId = model.StateId;
                City.CityName = model.CityName;
                City.Status = model.Status;

                if (City.CityId == 0)
                    dataContext.Cities.InsertOnSubmit(City);
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
        [Route("deleteCity")]
        public ExpandoObject DeleteCity(City model)
        {
            dynamic response = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var City = dataContext.Cities.Where(x => x.CityId == model.CityId).First();
                dataContext.Cities.DeleteOnSubmit(City);
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
