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
  selector: 'app-staff-login-role',
  templateUrl: './staff-login-role.component.html',
  styleUrls: ['./staff-login-role.component.css']
})
export class StaffLoginRoleComponent {

  dataLoading: boolean = false
  StaffLoginRoleList: any = []
  StaffLoginRole: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  StaffLoginList: any[] = []
  filterStaffLogin: any[] = []
  RoleList: any[] = []
  filterRole: any[] = []


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
    this.getStaffLoginRoleList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.getStaffLoginList();
    this.getRoleList();
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

  resetForm() {
    this.StaffLoginRole = {}
    this.isSubmitted = false
    this.StaffLoginRole.Status = 1
  }
  //
  //
  //  filterStaffList(value: any) {
  //    if (value) {
  //      const filterValue = value.toLowerCase();
  //      this.filterStaffLogin = this.StaffLoginList.filter((option: any) => option.UserName.toLowerCase().includes(filterValue));
  //    } else {
  //      this.filterStaffLogin = this.StaffLoginList;
  //    }
  //  }

  filterRoleList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterRole = this.RoleList.filter((option: any) => option.RoleTitle.toLowerCase().includes(filterValue));
    } else {
      this.filterRole = this.RoleList;
    }
  }

  getRoleList() {
    var obj = {}
    this.dataLoading = true
    this.service.getRoleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.RoleList = response.RoleList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
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

  getStaffLoginRoleList() {
    var obj = {}
    this.dataLoading = true
    this.service.getStaffLoginRoleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffLoginRoleList = response.StaffLoginRoleList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveStaffLoginRole(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.StaffLoginRole.UpdatedBy = this.StaffDetails.StaffLoginId

    this.dataLoading = true
    this.service.saveStaffLoginRole(this.StaffLoginRole).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.StaffLoginRole.StaffLoginRoleId > 0) {
          this.toastr.success("StaffLoginRole Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("StaffLoginRole added successfully")
        }
        this.resetForm()
        form.resetForm();
        this.getStaffLoginRoleList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteStaffLoginRole(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.service.deleteStaffLoginRole(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStaffLoginRoleList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
      }))
    }
  }

  editStaffLoginRole(obj: any) {
    this.resetForm()
    this.StaffLoginRole = obj
  }
}
