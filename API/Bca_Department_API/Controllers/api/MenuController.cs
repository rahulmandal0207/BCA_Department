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
    [RoutePrefix("api/Menu")]
    public class MenuController : ApiController
    {

        [HttpPost]
        [Route("MenuList")]
        public ExpandoObject MenuList(Menu model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var list = from d1 in dataContext.Menus
                           where d1.ParentMenuId == null
                           orderby d1.MenuTitle
                           join d2 in dataContext.Pages on d1.PageId equals d2.PageId into subPages
                           orderby d1.MenuTitle
                           select new
                           {
                               d1.MenuId,
                               d1.PageId,
                               PageName = subPages.Any() ? subPages.First().PageName : null,
                               d1.MenuTitle,
                               d1.MenuNo,
                               d1.ParentMenuId,
                               d1.MenuIcon,
                               d1.Status,
                               MenuList = from t1 in dataContext.Menus
                                          where t1.ParentMenuId == d1.MenuId
                                          join t2 in dataContext.Pages on t1.PageId equals t2.PageId
                                          orderby t1.MenuTitle
                                          
                                          select new
                                          {
                                              t1.MenuId,
                                              t1.PageId,
                                              t2.PageName,
                                              t1.MenuTitle,
                                              t1.MenuNo,
                                              t1.ParentMenuId,
                                              t1.MenuIcon,
                                              t1.Status,
                                          }
                           };

                ResponseMessage.MenuList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }

        [HttpPost]
        [Route("saveMenu")]
        public ExpandoObject SaveMenu(Menu model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                Menu Menu = null;
                if (model.MenuId > 0)
                {
                    Menu = dataContext.Menus.Where(x => x.MenuId == model.MenuId).First();
                    Menu.UpdatedBy = model.UpdatedBy;
                    Menu.UpdatedDate = DateTime.Now;
                }
                else
                {
                    Menu = new Menu();
                    var preMenu = dataContext.Menus.Where(x => x.ParentMenuId == model.ParentMenuId);
                    if (preMenu.Any())
                        Menu.MenuNo = preMenu.OrderByDescending(x => x.MenuNo).First().MenuNo + 1;
                    else
                        Menu.MenuNo = 1;
                }

                Menu.PageId = model.PageId;
                Menu.MenuIcon = model.MenuIcon;
                Menu.ParentMenuId = model.ParentMenuId;
                Menu.MenuTitle = model.MenuTitle;
                Menu.Status = model.Status;

                if (Menu.MenuId == 0)
                    dataContext.Menus.InsertOnSubmit(Menu);
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
        [Route("deleteMenu")]
        public ExpandoObject DeleteMenu(Menu model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var Menu = dataContext.Menus.Where(x => x.MenuId == model.MenuId).First();
                dataContext.Menus.DeleteOnSubmit(Menu);
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

        //[HttpPost]
        //[Route("UserMenuList")]
        //public ExpandoObject UserMenuList(StaffLogin model)
        //{
        //    dynamic ResponseMessage = new ExpandoObject();
        //    try
        //    {
        //        Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
        //        var staffLoginRoles = dataContext.StaffLoginRoles.Where(x => x.StaffLoginId == model.StaffLoginId);
        //        var TaskList = (from sr1 in dataContext.SystemLoginRoles
        //                        join r1 in dataContext.Roles
        //                        on sr1.RoleId equals r1.RoleId
        //                        join rt1 in dataContext.RoleTasks
        //                        on r1.RoleId equals rt1.RoleId
        //                        join t1 in dataContext.TaskMasters
        //                        on rt1.TaskMasterId equals t1.TaskMasterId
        //                        join m1 in dataContext.Menus
        //                        on rt1.TaskMasterId equals m1.TaskMasterId
        //                        where sr1.LoginId == LoginId
        //                        && t1.TaskMasterStatus == (byte)TaskMasterStatus.Active
        //                        && r1.RoleStatus == (byte)RoleStatus.Active
        //                        && rt1.RoleTaskStatus == (byte)RoleTaskStatus.Active
        //                        select new MenuModel
        //                        {
        //                            IconClass = m1.IconClass,
        //                            MenuId = m1.MenuId,
        //                            MenuPosition = m1.MenuPosition,
        //                            MenuTitle = m1.MenuTitle,
        //                            ParentMenuId = m1.ParentMenuId,
        //                            TaskMasterId = m1.TaskMasterId,
        //                            CanDelete = rt1.CanDelete,
        //                            CanEdit = rt1.CanEdit,
        //                            ActionName = t1.ActionName
        //                        }).Distinct();

        //        var list = (from m1 in dataContext.Menus.Where(x => x.ParentMenuId == null)
        //                    join t2 in TaskList
        //                    on m1.MenuId equals t2.MenuId into subTaskList2
        //                    from sTask2 in subTaskList2.DefaultIfEmpty()
        //                    where (sTask2.MenuId != null || m1.TaskMasterId == null)
        //        orderby m1.MenuPosition
        //                    select new MenuModel
        //                    {
        //                        IconClass = m1.IconClass,
        //                        MenuId = m1.MenuId,
        //                        MenuPosition = m1.MenuPosition,
        //                        MenuTitle = m1.MenuTitle,
        //                        ParentMenuId = m1.ParentMenuId,
        //                        TaskMasterId = m1.TaskMasterId,
        //                        CanEdit = sTask2.CanEdit != null ? sTask2.CanEdit : false,
        //                        CanDelete = sTask2.CanDelete != null ? sTask2.CanDelete : false,
        //                        ActionName = sTask2.ActionName != null ? sTask2.ActionName : null,
        //                        MenuList = (from m2 in dataContext.Menus.Where(x => x.ParentMenuId != null && x.ParentMenuId == m1.MenuId)
        //                                    join t1 in TaskList
        //                                    on m2.MenuId equals t1.MenuId into subTaskList
        //                                    from sTask in subTaskList.DefaultIfEmpty()
        //                                    where (sTask.MenuId != null || m2.TaskMasterId == null)
        //                                    orderby m2.MenuPosition
        //                                    select new MenuModel
        //                                    {
        //                                        IconClass = m2.IconClass,
        //                                        MenuId = m2.MenuId,
        //                                        MenuPosition = m2.MenuPosition,
        //                                        MenuTitle = m2.MenuTitle,
        //                                        ParentMenuId = m2.ParentMenuId,
        //                                        TaskMasterId = m2.TaskMasterId,
        //                                        CanEdit = sTask.CanEdit != null ? sTask.CanEdit : false,
        //                                        CanDelete = sTask.CanDelete != null ? sTask.CanDelete : false,
        //                                        ActionName = sTask.ActionName != null ? sTask.ActionName : null,
        //                                        MenuList = (from m3 in TaskList
        //                                                    where m3.ParentMenuId == m2.MenuId
        //                                                    orderby m3.MenuPosition
        //                                                    select new MenuModel
        //                                                    {
        //                                                        IconClass = m3.IconClass,
        //                                                        MenuId = m3.MenuId,
        //                                                        MenuPosition = m3.MenuPosition,
        //                                                        MenuTitle = m3.MenuTitle,
        //                                                        ParentMenuId = m3.ParentMenuId,
        //                                                        TaskMasterId = m3.TaskMasterId,
        //                                                        CanDelete = m3.CanDelete,
        //                                                        CanEdit = m3.CanEdit,
        //                                                        ActionName = m3.ActionName
        //                                                    }).ToList()
        //                                    }).ToList()
        //                    }).ToList();
        //        list.ForEach(menuOne => menuOne.MenuList = menuOne.MenuList.Where(x => x.MenuList.Any() || x.TaskMasterId != null).ToList());
        //        list = list.Where(x => x.MenuList.Any()).ToList();
        //        ResponseMessage.MenuList = list.ToList();
        //        ResponseMessage.Message = ConstantData.SuccessMessage;
        //    }
        //    catch (Exception ex)
        //    {
        //        ResponseMessage.Message = ex.Message;
        //    }
        //    return ResponseMessage;
        //}

        [HttpPost]
        [Route("UserMenuList")]
        public ExpandoObject UserMenuList(StaffLogin model)
        {
            dynamic ResponseMessage = new ExpandoObject();
            try
            {
                Bca_departmentDataContext dataContext = new Bca_departmentDataContext();
                var staffLoginRoles = dataContext.StaffLoginRoles.Where(x => x.StaffLoginId == model.StaffLoginId);
                var allMenuList = (from m1 in dataContext.RoleMenus
                                   join m2 in dataContext.Menus on m1.MenuId equals m2.MenuId
                                   where staffLoginRoles.Select(x => x.RoleId).Contains(m1.RoleId)
                                   select new { m1.MenuId, m2.ParentMenuId }).Distinct().ToList();


                var list = from d1 in dataContext.Menus
                           orderby d1.MenuNo
                           join d2 in dataContext.Pages on d1.PageId equals d2.PageId into subPages
                           where d1.ParentMenuId == null
                           && (allMenuList.Select(x => x.MenuId).Contains(d1.MenuId) || allMenuList.Select(x => x.ParentMenuId).Contains(d1.MenuId))
                           select new
                           {
                               d1.MenuId,
                               d1.PageId,
                               PageUrl = subPages.Any() ? subPages.First().PageUrl : null,
                               d1.MenuTitle,
                               d1.MenuNo,
                               d1.ParentMenuId,
                               d1.MenuIcon,
                               d1.Status,
                               MenuList = from t1 in dataContext.Menus
                                          orderby t1.MenuNo
                                          join t2 in dataContext.Pages on t1.PageId equals t2.PageId
                                          where t1.ParentMenuId == d1.MenuId
                                          && (allMenuList.Select(x => x.MenuId).Contains(t1.MenuId) || allMenuList.Select(x => x.ParentMenuId).Contains(t1.MenuId))
                                          select new
                                          {
                                              t1.MenuId,
                                              t1.PageId,
                                              t2.PageUrl,
                                              t1.MenuTitle,
                                              t1.MenuNo,
                                              t1.ParentMenuId,
                                              t1.MenuIcon,
                                              t1.Status,
                                          }
                           };

                ResponseMessage.MenuList = list.ToList();
                ResponseMessage.Message = ConstantData.SuccessMessage;
            }
            catch (Exception ex)
            {
                ResponseMessage.Message = ex.Message;
            }
            return ResponseMessage;
        }
    }
}
