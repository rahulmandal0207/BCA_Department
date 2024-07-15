import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/utils/app.service';
import { ConstantData } from 'src/app/utils/constant-data';
import { ActionModel } from 'src/app/utils/interface';
import { LoadDataService } from 'src/app/utils/load-data.service';
import { LocalService } from 'src/app/utils/local.service';
declare var $:any;

@Component({
  selector: 'app-page-group',
  templateUrl: './page-group.component.html',
  styleUrls: ['./page-group.component.css']
})
export class PageGroupComponent {
  dataLoading: boolean = false
  PageGroupList: any = []
  PageGroup: any = {}
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
    this.getPageGroupList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu();
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
    this.PageGroup = {}
    this.isSubmitted = false
    this.PageGroup.Status = 1
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PageGroupList.filter = filterValue.trim().toLowerCase();
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

  getPageGroupList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPageGroupList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PageGroupList = response.PageGroupList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  savePageGroup(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.PageGroup.UpdatedBy = this.StaffDetails.StaffLoginId;
    this.dataLoading = true;
    this.service.savePageGroup(this.PageGroup).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PageGroup.PageGroupId > 0) {
          this.toastr.success("PageGroup detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("PageGroup added successfully")
          $('#staticBackdrop').modal('hide')
        }
        this.resetForm()
        form.resetForm();
        this.getPageGroupList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deletePageGroup(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.service.deletePageGroup(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getPageGroupList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
      }))
    }
  }

  editPageGroup(obj: any) {
    this.resetForm()
    this.PageGroup = obj

  }
}
