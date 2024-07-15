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
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {
  dataLoading: boolean = false
  PageList: any = []
  Page: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageGroupList: any[] = []
  filterPageGroup: any[] = []
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
    this.getPageList();
    this.getStatusList();
    this.getPageGroupList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu()
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
    this.Page = {}
    this.isSubmitted = false
    this.Page.Status = 1
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PageList.filter = filterValue.trim().toLowerCase();
  }

  filterPageGroupList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterPageGroup = this.PageGroupList.filter((option: any) => option.PageGroupName.toLowerCase().includes(filterValue));
    } else {
      this.filterPageGroup = this.PageGroupList;
    }
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

  getPageList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPageList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PageList = response.PageList;
        //this.PageList.sort = this.sort;
        //this.PageList.paginator = this.paginator;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  savePage(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Page.UpdatedBy = this.StaffDetails.StaffLoginId;
    this.dataLoading = true;
    this.service.savePage(this.Page).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Page.PageId > 0) {
          this.toastr.success("Page detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Page added successfully")
          $('#staticBackdrop').modal('hide')
        }
        //var page = this.Page;
        this.resetForm();
        form.resetForm();
        //this.Page.PageGroupId = page.PageGroupId;
        //this.Page.Status = page.Status;
        this.getPageList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deletePage(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.service.deletePage(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getPageList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
      }))
    }
  }

  editPage(obj: any) {
    this.resetForm()
    this.Page = obj
  }
}
