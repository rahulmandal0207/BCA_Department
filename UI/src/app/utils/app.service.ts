import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly baseUrl = "https://localhost:44379/"

  private readonly apiUrl = this.baseUrl + "api/"

  constructor(private http: HttpClient) { }

  getBaseUrl() {
    return this.baseUrl;
  }

  // Status 
  getStatusList(obj: any) {
    return this.http.post(this.apiUrl + "enum/StatusList", obj)
  }

  //  gender 
  getGenderList(obj: any) {
    return this.http.post(this.apiUrl + "enum/GenderList", obj)
  }

  // Staff Type
  getStaffTypeList(obj: any) {
    return this.http.post(this.apiUrl + "enum/StaffTypeList", obj)
  }

  // Category Type
  getCategoryList(obj: any) {
    return this.http.post(this.apiUrl + "enum/CategoryList", obj)
  }

  // BloodGroup Type
  getBloodGroupList(obj: any) {
    return this.http.post(this.apiUrl + "enum/BloodGroupList", obj)
  }

  // Religion Type
  getReligionList(obj: any) {
    return this.http.post(this.apiUrl + "enum/ReligionList", obj)
  }

  // Subject Type
  getSubjectTypeList(obj: any) {
    return this.http.post(this.apiUrl + "enum/SubjectTypeList", obj)
  }


  // Staff Login
  StaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLogin", obj)
  }

  getStaffLoginList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLoginList", obj)
  }

  saveStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/saveStaffLogin", obj)
  }

  deleteStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/deleteStaffLogin", obj)
  }

  /* ---------------------------------------------------------------------- */

  // Staff
  getStaffList(obj: any) {
    return this.http.post(this.apiUrl + "Staff/StaffList", obj)
  }

  saveStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/saveStaff", obj)
  }

  deleteStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/deleteStaff", obj)
  }

  /* ---------------------------------------------------------------------- */

  //Page
  getPageList(obj: any) {
    return this.http.post(this.apiUrl + "Page/PageList", obj)
  }

  savePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/savePage", obj)
  }

  deletePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/deletePage", obj)
  }

  /* ---------------------------------------------------------------------- */

  //PageGroup
  getPageGroupList(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/PageGroupList", obj)
  }

  savePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/savePageGroup", obj)
  }

  deletePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/deletePageGroup", obj)
  }

  /* ---------------------------------------------------------------------- */

  //Menu
  getUserMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/UserMenuList", obj)
  }

  getMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuList", obj)
  }

  saveMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/saveMenu", obj)
  }

  deleteMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/deleteMenu", obj)
  }

  validiateMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/ValidiateMenu", obj)
  }



  /* ---------------------------------------------------------------------- */

  //Role
  getRoleList(obj: any) {
    return this.http.post(this.apiUrl + "Role/RoleList", obj)
  }

  saveRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/saveRole", obj)
  }

  deleteRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/deleteRole", obj)
  }

  /* ---------------------------------------------------------------------- */

  //RoleMenu
  getRoleMenuList(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/AllRoleMenuList", obj)
  }

  saveRoleMenu(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/saveRoleMenu", obj)
  }


  /* ---------------------------------------------------------------------- */

  //StaffLoginRole
  getStaffLoginRoleList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/StaffLoginRoleList", obj)
  }

  saveStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/saveStaffLoginRole", obj)
  }

  deleteStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/deleteStaffLoginRole", obj)
  }

  /* ---------------------------------------------------------------------- */

  //designation 
  getDesignationList(obj: any) {
    return this.http.post(this.apiUrl + "Designation/DesignationList", obj)
  }

  saveDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/saveDesignation", obj)
  }

  deleteDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/deleteDesignation", obj)
  }
  /* ---------------------------------------------------------------------- */

  //DptStaff 
  getDptStaffList(obj: any) {
    return this.http.post(this.apiUrl + "DptStaff/DptStaffList", obj)
  }

  saveDptStaff(obj: any) {
    return this.http.post(this.apiUrl + "DptStaff/saveDptStaff", obj)
  }

  deleteDptStaff(obj: any) {
    return this.http.post(this.apiUrl + "DptStaff/deleteDptStaff", obj)
  }

  saveDptDp(obj: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl + '/DptStaff/saveDptStaffDp', obj, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  /* ---------------------------------------------------------------------- */

  //Notice 
  getNoticeList(obj: any) {
    return this.http.post(this.apiUrl + "Notice/NoticeList", obj)
  }

  saveNotice(obj: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl + '/Notice/saveNotice', obj, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  deleteNotice(obj: any) {
    return this.http.post(this.apiUrl + "Notice/deleteNotice", obj);
  }

  updateStatus(obj: any) {
    return this.http.post(this.apiUrl + "Notice/UpdateStatus", obj);
  }

  /* ---------------------------------------------------------------------- */
  //State 
  getStateList(obj: any) {
    return this.http.post(this.apiUrl + "State/StateList", obj)
  }

  saveState(obj: any) {
    return this.http.post(this.apiUrl + "State/saveState", obj)
  }

  deleteState(obj: any) {
    return this.http.post(this.apiUrl + "State/deleteState", obj)
  }

  /* ---------------------------------------------------------------------- */

  //City 
  getCityList(obj: any) {
    return this.http.post(this.apiUrl + "City/CityList", obj)
  }

  saveCity(obj: any) {
    return this.http.post(this.apiUrl + "City/saveCity", obj)
  }

  deleteCity(obj: any) {
    return this.http.post(this.apiUrl + "City/deleteCity", obj)
  }

  /* ---------------------------------------------------------------------- */

  //Session 
  getSessionList(obj: any) {
    return this.http.post(this.apiUrl + "Session/SessionList", obj)
  }

  saveSession(obj: any) {
    return this.http.post(this.apiUrl + "Session/saveSession", obj)
  }

  deleteSession(obj: any) {
    return this.http.post(this.apiUrl + "Session/deleteSession", obj)
  }



  /* ---------------------------------------------------------------------- */

  //Student 
  getStudentList(obj: any) {
    return this.http.post(this.apiUrl + "Student/StudentList", obj)
  }
  getAllStudentList(obj: any) {
    return this.http.post(this.apiUrl + "Student/AllStudentList", obj)
  }
  getStudentUtilsList(obj: any) {
    return this.http.post(this.apiUrl + "Student/StudentUtils", obj)
  }

  saveStudent(obj: any) {
    return this.http.post(this.apiUrl + "Student/saveStudent", obj)
  }

  deleteStudent(obj: any) {
    return this.http.post(this.apiUrl + "Student/deleteStudent", obj)
  }

  saveStudentDp(obj: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl + '/Student/saveStudentDp', obj, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  /* ---------------------------------------------------------------------- */

  //FeePaid 
  getFeePaidList(obj: any) {
    return this.http.post(this.apiUrl + "FeePaid/FeePaidList", obj)
  }

  saveFeePaid(obj: any) {
    return this.http.post(this.apiUrl + "FeePaid/saveFeePaid", obj)
  }

  deleteFeePaid(obj: any) {
    return this.http.post(this.apiUrl + "FeePaid/deleteFeePaid", obj)
  }

  /* ---------------------------------------------------------------------- */

  //Subject 
  getSubjectList(obj: any) {
    return this.http.post(this.apiUrl + "Subject/SubjectList", obj)
  }

  saveSubject(obj: any) {
    return this.http.post(this.apiUrl + "Subject/saveSubject", obj)
  }

  deleteSubject(obj: any) {
    return this.http.post(this.apiUrl + "Subject/deleteSubject", obj)
  }

  /* ---------------------------------------------------------------------- */

  //Grade 
  getGradeList(obj: any) {
    return this.http.post(this.apiUrl + "Grade/GradeList", obj)
  }

  saveGrade(obj: any) {
    return this.http.post(this.apiUrl + "Grade/saveGrade", obj)
  }

  deleteGrade(obj: any) {
    return this.http.post(this.apiUrl + "Grade/deleteGrade", obj)
  }

  //SessionSubject 
  getSessionSubjectList(obj: any) {
    return this.http.post(this.apiUrl + "SessionSubject/SessionSubjectList", obj)
  }

  saveSessionSubject(obj: any) {
    return this.http.post(this.apiUrl + "SessionSubject/saveSessionSubject", obj)
  }

  deleteSessionSubject(obj: any) {
    return this.http.post(this.apiUrl + "SessionSubject/deleteSessionSubject", obj)
  }

  //Syllabus 
  getSyllabusList(obj: any) {
    return this.http.post(this.apiUrl + "Syllabus/SyllabusList", obj)
  }

  saveSyllabus(obj: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl + '/Syllabus/saveSyllabus', obj, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  deleteSyllabus(obj: any) {
    return this.http.post(this.apiUrl + "Syllabus/deleteSyllabus", obj)
  }

  //TopStudent 
  getTopStudentList(obj: any) {
    return this.http.post(this.apiUrl + "TopStudent/TopStudentList", obj)
  }

  saveTopStudent(obj: any) {
    return this.http.post(this.apiUrl + "TopStudent/saveTopStudent", obj)
  }

  deleteTopStudent(obj: any) {
    return this.http.post(this.apiUrl + "TopStudent/deleteTopStudent", obj)
  }

  //Notes 
  getNotesList(obj: any) {
    return this.http.post(this.apiUrl + "Notes/NotesList", obj)
  }
  saveNotes(obj: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl + '/Notes/saveNotes', obj, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  deleteNotes(obj: any) {
    return this.http.post(this.apiUrl + "Notes/deleteNotes", obj)
  }

}
