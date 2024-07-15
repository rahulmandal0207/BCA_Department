import { Component, HostListener } from '@angular/core';
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
  selector: 'app-session-subject',
  templateUrl: './session-subject.component.html',
  styleUrls: ['./session-subject.component.css']
})
export class SessionSubjectComponent {
  dataLoading: boolean = false
  SessionSubjectList: any = []
  SessionSubject: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'SubjectCode';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  action: ActionModel = {} as ActionModel;
  SelectedSession: any = {};
  SemesterList: any = ConstantData.SemesterList;


  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private router: Router,
    private loadData: LoadDataService
  ) { }

  ngOnInit(): void {
    //this.getSessionSubjectList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSessionList();
    this.getSubjectList();
    this.getSubjectTypeList();
    this.validiateMenu();
  }




  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
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
    this.SessionSubject = {}
    this.isSubmitted = false
    this.SessionSubject.Status = 1
    if (this.SelectedSession.SessionId > 0)
      this.SessionSubject.SessionId = this.SelectedSession.SessionId;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.SessionSubjectList.filter = filterValue.trim().toLowerCase();
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

  SubjectTypeList: any = []
  getSubjectTypeList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSubjectTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SubjectTypeList = response.SubjectTypeList
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching SubjectType records")
      this.dataLoading = false;
    }))
  }

  getSessionSubjectList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSessionSubjectList(this.SelectedSession).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionSubjectList = response.SessionSubjectList;

        this.getSemesterList();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveSessionSubject(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.SessionSubject.UpdatedBy = this.StaffDetails.StaffLoginId;

    this.dataLoading = true;
    this.service.saveSessionSubject(this.SessionSubject).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.SessionSubject.SessionSubjectId > 0) {
          this.toastr.success("SessionSubject Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("SessionSubject added successfully")
          $('#staticBackdrop').modal('hide')

        }
        this.resetForm()
        form.resetForm();
        this.getSessionSubjectList()

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteSessionSubject(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteSessionSubject(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getSessionSubjectList()
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

  editSessionSubject(obj: any) {
    this.resetForm()
    this.SessionSubject = obj
  }

  SessionList: any = []
  getSessionList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        console.log(this.SessionList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  SubjectList: any = []
  AllSubjectList: any = []
  getSubjectList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSubjectList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSubjectList = response.SubjectList;

        //this.SubjectList = this.AllSubjectList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  SemesterOneList: any = []
  SemesterTwoList: any = []
  SemesterThreeList: any = []
  SemesterFourList: any = []
  SemesterFiveList: any = []
  SemesterSixList: any = []

  SessionSubjectCombined: any = []
  getSemesterList() {
    this.SemesterOneList = []
    this.SemesterTwoList = []
    this.SemesterThreeList = []
    this.SemesterFourList = []
    this.SemesterFiveList = []
    this.SemesterSixList = []
    this.SessionSubjectCombined = []

    this.SessionSubjectList.forEach((el: any) => {
      if (el.Semester == 1)
        this.SemesterOneList.push(el);
      else if (el.Semester == 2)
        this.SemesterTwoList.push(el);
      else if (el.Semester == 3)
        this.SemesterThreeList.push(el);
      else if (el.Semester == 4)
        this.SemesterFourList.push(el);
      else if (el.Semester == 5)
        this.SemesterFiveList.push(el);
      else if (el.Semester == 6)
        this.SemesterSixList.push(el);
    });

    this.SessionSubjectCombined.push(this.SemesterOneList);
    this.SessionSubjectCombined.push(this.SemesterTwoList);
    this.SessionSubjectCombined.push(this.SemesterThreeList);
    this.SessionSubjectCombined.push(this.SemesterFourList);
    this.SessionSubjectCombined.push(this.SemesterFiveList);
    this.SessionSubjectCombined.push(this.SemesterSixList);

  }


  filterSubjectList(value:any) {
    console.log(value)
    if (value) {
      this.SubjectList = this.AllSubjectList.filter((option: any) => option.SubjectName.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.SubjectList = this.AllSubjectList;
    }
  }


  
}
