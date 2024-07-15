import { Component } from '@angular/core';
import { ConstantData } from '../../utils/constant-data';
import { AppService } from '../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../utils/local.service';
import { NgForm } from '@angular/forms';
import { ActionModel } from 'src/app/utils/interface';
import { Router } from '@angular/router';
import { LoadDataService } from 'src/app/utils/load-data.service';
declare var $: any;


@Component({
  selector: 'app-top-student',
  templateUrl: './top-student.component.html',
  styleUrls: ['./top-student.component.css']
})
export class TopStudentComponent {
  dataLoading: boolean = false
  TopStudentList: any = []
  TopStudent: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  action: ActionModel = {} as ActionModel;
  SelectedSession: any = {};


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
    private localService: LocalService,
    private router: Router,
    private loadData: LoadDataService
  ) { }

  ngOnInit(): void {
    this.getTopStudentList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSessionList();
    
  }

  validiateMenu() {
    var obj = {
      Url: this.router.url,
      StaffLoginId: this.StaffDetails.StaffLoginId
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  resetForm() {
    this.TopStudent = {}
    this.isSubmitted = false
    this.TopStudent.Status = 1
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TopStudentList.filter = filterValue.trim().toLowerCase();
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

  getTopStudentList() {

    this.dataLoading = true;
    this.service.getTopStudentList(this.SelectedSession).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TopStudentList = response.TopStudentList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveTopStudent(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.TopStudent.SessionId = this.SelectedSession.SessionId;

    this.dataLoading = true;
    this.service.saveTopStudent(this.TopStudent).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TopStudent.TopStudentId > 0) {
          this.toastr.success("TopStudent Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("TopStudent added successfully")
          $('#staticBackdrop').modal('hide')

        }
        this.resetForm()
        form.resetForm();
        this.getTopStudentList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteTopStudent(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteTopStudent(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTopStudentList()
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

  editTopStudent(obj: any) {
    this.resetForm()
    this.TopStudent = obj
  }

  SessionList: any = []
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

  AllStudentList: any = []
  StudentList: any = []

  getStudentList() {

    this.dataLoading = true;
    this.service.getStudentList(this.SelectedSession).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStudentList = response.StudentList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))


  }

  filterStudentList(value: any) {
    console.log(value)
    if (value) {
      this.StudentList = this.AllStudentList.filter((option: any) => option.StudentName.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.StudentList = this.AllStudentList;
    }
  }


}
