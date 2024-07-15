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
    [RoutePrefix("api/RoleMenu")]
    public class RoleMenuController : ApiController
    {
        public class RoleMenuModel
        {
            public bool IsSelected { get; set; }
            public int RoleMenuId { get; set; }
            public int MenuId { get; set; }
            public string MenuTitle { get; set; }
            public bool CanEdit { get; set; }
            public bool CanDelete { get; set; }
            public bool CanCreate { get; set; }
        }

        [HttpPost]
        [Route("AllRoleMenuList")]
        public ExpandoObject AllRoleMenuList(Role model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from tg1 in dataContext.PageGroups
                           orderby tg1.PageGroupName
                           select new
                           {
                               tg1.PageGroupName,
                               tg1.PageGroupId,
                               RoleMenuList = from tm1 in dataContext.Pages
                                              join m1 in dataContext.Menus
                                              on tm1.PageId equals m1.PageId
                                              join r1 in dataContext.RoleMenus.Where(x => x.RoleId == model.RoleId)
                                              on m1.MenuId equals r1.MenuId into RoleMenuList
                                              from RoleMenu in RoleMenuList.DefaultIfEmpty()
                                              where tm1.PageGroupId == tg1.PageGroupId
                                              && (model.Status == 0 || tm1.Status == model.Status)
                                              select new RoleMenuModel
                                              {
                                                  IsSelected = RoleMenu.RoleId != null ? true : false,
                                                  MenuId = m1.MenuId,
                                                  MenuTitle = m1.MenuTitle,
                                                  RoleMenuId = RoleMenu.RoleMenuId != null ? RoleMenu.RoleMenuId : 0,
                                                  CanEdit = RoleMenu.CanEdit != null ? RoleMenu.CanEdit : false,
                                                  CanDelete = RoleMenu.CanDelete != null ? RoleMenu.CanDelete : false,
                                                  CanCreate = RoleMenu.CanCreate != null ? RoleMenu.CanCreate : false,
                                              }
                           };
                ResponseMessage.AllRoleMenuList = list.Where(x => x.RoleMenuList.Any()).ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        public class SaveRoleMenuModel
        {
            public int RoleId { get; set; }
            public int StaffLoginId { get; set; }
            public List<RoleMenuModel> RoleMenuList { get; set; }
        }

        [HttpPost]
        [Route("saveRoleMenu")]
        public ExpandoObject SaveRoleMenu(SaveRoleMenuModel data)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                data.RoleMenuList.ForEach(model =>
                {
                    if (model.RoleMenuId > 0 && !model.IsSelected)
                    {
                        var RoleMenu = dataContext.RoleMenus.Where(x => x.RoleMenuId == model.RoleMenuId).First();
                        dataContext.RoleMenus.DeleteOnSubmit(RoleMenu);
                        dataContext.SubmitChanges();
                    }
                    else if (model.IsSelected)
                    {
                        RoleMenu RoleMenu = null;
                        if (model.RoleMenuId > 0)
                            RoleMenu = dataContext.RoleMenus.Where(x => x.RoleMenuId == model.RoleMenuId).First();
                        else
                            RoleMenu = new RoleMenu
                            {
                                RoleId = data.RoleId,
                                MenuId = model.MenuId,
                            };
                        RoleMenu.UpdatedBy = data.StaffLoginId;
                        RoleMenu.UpdatedDate = DateTime.Now;
                        RoleMenu.CanDelete = model.CanDelete;
                        RoleMenu.CanEdit = model.CanEdit;
                        RoleMenu.CanCreate = model.CanCreate;
                        if (RoleMenu.RoleMenuId == 0)
                            dataContext.RoleMenus.InsertOnSubmit(RoleMenu);
                        dataContext.SubmitChanges();
                    }
                });

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
    }
}
