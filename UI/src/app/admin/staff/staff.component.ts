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
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent {
  dataLoading: boolean = false
  StaffList: any = []
  Staff: any = {}
  isSubmitted = false
  StatusList: any[] = []
  GenderList: any[] = []
  StaffTypeList: any[] = []
  DepartmentList: any = []
  DesignationList: any = []
  filterDepartment: any[] = []
  filterDesignation: any[] = []
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
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.getStaffList();
    this.getStatusList();
    this.getGenderList();
    this.getStaffTypeList();

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
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  filterDesignationList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterDesignation = this.DesignationList.filter((option: any) => option.DesignationName.toLowerCase().includes(filterValue));
    } else {
      this.filterDesignation = this.DesignationList;
    }
  }

  filterDepartmentList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterDepartment = this.DepartmentList.filter((option: any) => option.DepartmentName.toLowerCase().includes(filterValue));
    } else {
      this.filterDepartment = this.DepartmentList;
    }
  }

  resetForm() {
    this.Staff = {}
    this.isSubmitted = false
    this.Staff.Status = 1
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

  getGenderList() {
    var obj = {}
    this.service.getGenderList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.GenderList = response.GenderList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching Gender records")
    }))
  }

  getStaffTypeList() {
    var obj = {}
    this.service.getStaffTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffTypeList = response.StaffTypeList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching StaffType records")
    }))
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

  saveStaff(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Staff.JoinDate = this.loadDataService.loadDateTime(this.Staff.JoinDate);
    this.Staff.DOB = this.loadDataService.loadDateTime(this.Staff.DOB);

    this.Staff.UpdatedBy = this.StaffDetails.StaffLoginId;
    this.Staff.CreatedBy = this.StaffDetails.StaffLoginId;

    this.dataLoading = true;
    this.service.saveStaff(this.Staff).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Staff.StaffId > 0) {
          this.toastr.success("Staff Updated successfully")
          $('#staticBackdrop').modal('hide')

        } else {
          this.toastr.success("Staff added successfully")
        }
        this.resetForm()
        form.resetForm();
        this.getStaffList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false

    }))
  }

  deleteStaff(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteStaff(obj).subscribe((r1: any) => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStaffList()
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

  editStaff(obj: any) {
    this.resetForm()
    this.Staff = obj
  }
}
