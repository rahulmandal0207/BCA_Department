import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/utils/app.service';
import { ConstantData } from 'src/app/utils/constant-data';
import { ActionModel } from 'src/app/utils/interface';
import { LoadDataService } from 'src/app/utils/load-data.service';
import { LocalService } from 'src/app/utils/local.service';
declare var $: any;

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent {

  dataLoading: boolean = false
  StaffLoginList: any = []
  StaffLogin: any = {}

  isSubmitted = false
  StatusList: any[] = []
  StaffList: any[] = []
  SchoolList: any[] = []
  filterStaff: any[] = []
  filterSchool: any[] = []
  hide = true
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}

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
    this.getStaffLoginList();
    this.getStatusList();
    this.getStaffList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu();
  }
  action: ActionModel = {} as ActionModel;
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

  filterStaffList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterStaff = this.StaffList.filter((option: any) => option.StaffName.toLowerCase().includes(filterValue));
    } else {
      this.filterStaff = this.StaffList;
    }
  }

  filterSchoolList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterSchool = this.SchoolList.filter((option: any) => option.SchoolName.toLowerCase().includes(filterValue));
    } else {
      this.filterSchool = this.SchoolList;
    }
  }

  resetForm() {
    this.StaffLogin = {}
    this.isSubmitted = false
    this.StaffLogin.Status = 1
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.StaffLoginList.filter = filterValue.trim().toLowerCase();
  }

  getStaffList() {
    var obj = {}
    this.dataLoading = true
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffList = response.StaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  getStatusList() {
    var obj = {}
    this.service.getStatusList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StatusList = response.StatusList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching status records")
    }))
  }

  getStaffLoginList() {
    var obj = {}
    this.dataLoading = true
    this.service.getStaffLoginList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffLoginList = response.StaffLoginList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveStaffLogin(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.StaffLogin.UpdatedBy = this.StaffDetails.StaffLoginId
    this.StaffLogin.CreateBy = this.StaffDetails.StaffLoginId

    this.dataLoading = true;
    this.service.saveStaffLogin(this.StaffLogin).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.StaffLogin.StaffLoginId > 0) {
          this.toastr.success("StaffLogin Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("StaffLogin added successfully")
        }
        this.resetForm()
        form.resetForm();
        this.getStaffLoginList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false

    }))
  }

  deleteStaffLogin(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.service.deleteStaffLogin(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStaffLoginList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
      }))
    }
  }

  editStaffLogin(obj: any) {
    this.resetForm()
    this.StaffLogin = obj

  }
}
