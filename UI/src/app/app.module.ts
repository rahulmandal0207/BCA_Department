import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleComponent } from './admin/role/role.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { StaffComponent } from './admin/staff/staff.component';
import { MaterialModule } from './material/material.module';
import { NgxPaginationModule } from "ngx-pagination";
import { OrderModule } from "ngx-order-pipe";
import { Ng2SearchPipeModule } from "ng2-search-filter";
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
import { ProgressComponent } from './components/progress/progress.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { InstructorComponent } from './instructor/instructor.component';
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
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SessionSubjectComponent } from './admin/session-subject/session-subject.component';
import { SyllabusComponent } from './admin/syllabus/syllabus.component';
import { TopStudentComponent } from './admin/top-student/top-student.component';
import { NotesComponent } from './admin/notes/notes.component';
import { ShowNoticeComponent } from './show-notice/show-notice.component';

@NgModule({
  declarations: [
    AppComponent,
    RoleComponent,
    AdminMasterComponent,
    HomeComponent,
    DashboardComponent,
    AdminLoginComponent,
    StaffComponent,
    PageNotFoundComponent,
    PageComponent,
    MenuComponent,
    RoleMenuComponent,
    PageGroupComponent,

    StaffLoginComponent,
    StaffLoginRoleComponent,
    MasterComponent,
    AdmissionComponent,
    CourseComponent,
    GalleryComponent,
    ProgressComponent,
    PreloaderComponent,
    InstructorComponent,
    DesignationComponent,
    DptStaffComponent,
    NoticeComponent,
    StateComponent,
    CityComponent,
    SessionComponent,
    StudentComponent,
    NewStudentComponent,
    FeepaidComponent,
    PerformanceComponent,
    SubjectComponent,
    GradeComponent,
    SessionSubjectComponent,
    SyllabusComponent,
    TopStudentComponent,
    NotesComponent,
    ShowNoticeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot({
      //positionClass: 'toast-bottom-right'
    }

    ),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    OrderModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    AutocompleteLibModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
