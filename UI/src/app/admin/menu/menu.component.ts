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
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  dataLoading: boolean = false
  MenuList: any = []
  Menu: any = {}
  isSubmitted = false
  StatusList: any[] = []
  filterPage: any[] = []
  PageList: any[] = []
  ParentMenuId: any = null;
  StaffDetials: any = {}
  action: ActionModel = {} as ActionModel;



  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private router: Router,
    private loadData: LoadDataService
  ) { }

  ngOnInit(): void {
    this.getMenuList();
    this.getStatusList();
    this.getPageList();
    this.StaffDetials = this.localService.getEmployeeDetail();
    this.validiateMenu();
  }

  validiateMenu() {
    var obj = {
      Url: this.router.url,
      StaffLoginId: this.StaffDetials.StaffLoginId
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
    this.Menu = {}
    this.isSubmitted = false
    this.Menu.Status = 1
    this.ParentMenuId = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.MenuList.filter = filterValue.trim().toLowerCase();
  }

  filterPageList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterPage = this.PageList.filter((option: any) => option.PageName.toLowerCase().includes(filterValue));
    } else {
      this.filterPage = this.PageList;
    }
  }


  getPageList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPageList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PageList = response.PageList;
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

  getMenuList() {
    var obj = {}
    this.dataLoading = true
    this.service.getMenuList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MenuList = response.MenuList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveMenu(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Menu.UpdatedBy = this.StaffDetials.StaffLoginId

    this.dataLoading = true
    this.service.saveMenu(this.Menu).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Menu.MenuId > 0) {
          this.toastr.success("Menu detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Menu added successfully")
          $('#staticBackdrop').modal('hide')

        }
        this.resetForm()
        form.resetForm();
        this.getMenuList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteMenu(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.service.deleteMenu(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getMenuList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the record")
      }))
    }
  }

  editMenu(obj: any) {
    this.resetForm()
    this.Menu = obj
  }

}
