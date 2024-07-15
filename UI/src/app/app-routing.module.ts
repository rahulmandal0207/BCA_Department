import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './admin/role/role.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { StaffComponent } from './admin/staff/staff.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageComponent } from './admin/page/page.component';
import { MenuComponent } from './admin/menu/menu.component';
import { RoleMenuComponent } from './admin/role-menu/role-menu.component';
import { PageGroupComponent } from './admin/page-group/page-group.component';
import { StaffLoginComponent } from './admin/staff-login/staff-login.component';
import { StaffLoginRoleComponent } from './admin/staff-login-role/staff-login-role.component';
import { MasterComponent } from './master/master.component';
import { AdmissionComponent } from './admission/admission.component';
import { CourseComponent } from './course/course.component';
import { GalleryComponent } from './gallery/gallery.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { DptStaffComponent } from './admin/dpt-staff/dpt-staff.component';
import { NoticeComponent } from './admin/notice/notice.component';
import { StateComponent } from './admin/state/state.component';
import { CityComponent } from './admin/city/city.component';
import { SessionComponent } from './admin/session/session.component';
import { StudentComponent } from './admin/student/student.component';
import { NewStudentComponent } from './admin/new-student/new-student.component';
import { FeepaidComponent } from './admin/feepaid/feepaid.component';
import { PerformanceComponent } from './performance/performance.component';
import { SubjectComponent } from './admin/subject/subject.component';
import { GradeComponent } from './admin/grade/grade.component';
import { SessionSubjectComponent } from './admin/session-subject/session-subject.component';
import { SyllabusComponent } from './admin/syllabus/syllabus.component';
import { TopStudentComponent } from './admin/top-student/top-student.component';
import { NotesComponent } from './admin/notes/notes.component';

const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: "full" },
  {
    path: 'home', component: MasterComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'admission', component: AdmissionComponent },
      { path: 'course', component: CourseComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'performance', component: PerformanceComponent},
    ]
  },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: "admin", component: AdminMasterComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: "dashboard", component: DashboardComponent, },
      { path: "role", component: RoleComponent },
      { path: "staff", component: StaffComponent },
      { path: 'page', component: PageComponent },
      { path: 'menu', component: MenuComponent },
      { path: "role-menu", component: RoleMenuComponent },
      { path: 'page-group', component: PageGroupComponent },
      { path: 'staff-login', component: StaffLoginComponent },
      { path: 'staff-login-role', component: StaffLoginRoleComponent },
      { path: 'designation', component: DesignationComponent },
      { path: 'dpt-staff', component: DptStaffComponent },
      { path: 'notice', component: NoticeComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'session', component: SessionComponent },
      { path: 'student', component: StudentComponent },
      { path: 'new-student', component: NewStudentComponent },
      { path: 'feepaid', component: FeepaidComponent },
      { path: 'subject', component: SubjectComponent },
      { path: 'grade', component: GradeComponent },
      { path: 'session-subject', component: SessionSubjectComponent },
      { path: 'syllabus', component: SyllabusComponent },
      { path: 'top-student', component: TopStudentComponent },
      { path: 'notes', component: NotesComponent },
    ]
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
