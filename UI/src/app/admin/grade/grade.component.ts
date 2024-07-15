import { Component } from '@angular/core';
import { ConstantData } from '../../utils/constant-data';
import { AppService } from '../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../utils/local.service';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent {
  dataLoading: boolean = false
  GradeList: any = []
  Grade: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  SessionList: any = []

  StudentList: any = []
  SemesterList: any = ConstantData.SemesterList;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    //this.getGradeList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.getSessionList();
    this.getStudentList();
  }

  resetForm() {
    this.Grade = {}
    this.isSubmitted = false
    this.Grade.Status = 1

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.GradeList.filter = filterValue.trim().toLowerCase();
  }

  getStatusList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getStatusList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StatusList = response.StatusList
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching status records")
      this.dataLoading = false;
    }))
  }

  getGradeList() {
    var obj = {
      SessionId: this.Grade.SessionId,
      StudentId: this.Grade.StudentId,
      Semester: this.Grade.Semester
    }
    this.dataLoading = true;
    this.service.getGradeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.GradeList = response.GradeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveGrade() {
    this.isSubmitted = true
    //if (form.invalid) {
    //  this.toastr.error("Fill all the required fields !!")
    //  return
    //}
    this.Grade.UpdatedBy = this.StaffDetails.StaffLoginId;

    this.dataLoading = true;
    this.service.saveGrade(this.Grade).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Grade.GradeId > 0) {
          this.toastr.success("Grade Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Grade added successfully")
          $('#staticBackdrop').modal('hide')

        }
        this.resetForm()
        //form.resetForm();
        this.getGradeList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteGrade(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteGrade(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getGradeList()
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  editGrade(obj: any) {
    this.resetForm()
    this.Grade = obj
  }

  getSessionList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  getStudentList() {
    var obj = {
      SessionId: this.Grade.SessionId
    }
    this.dataLoading = true;
    this.service.getStudentList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentList = response.StudentList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  SessionSubjectList: any = []
  getSessionSubjectList() {
    var obj = {
      SessionId: this.Grade.SessionId
    }
    this.dataLoading = true;
    this.service.getSessionSubjectList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionSubjectList = response.SessionSubjectList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  onSessionChange() {
    this.getStudentList();
    this.getSessionSubjectList();
  }

}
