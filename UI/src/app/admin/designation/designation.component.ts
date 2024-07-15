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
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent {
  dataLoading: boolean = false
  DesignationList: any = []
  Designation: any = {}
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
    this.getDesignationList();
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
    this.Designation = {}
    this.isSubmitted = false
    this.Designation.Status = 1
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DesignationList.filter = filterValue.trim().toLowerCase();
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

  getDesignationList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getDesignationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.DesignationList = response.DesignationList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveDesignation(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Designation.UpdatedBy = this.StaffDetails.StaffLoginId;

    this.dataLoading = true;
    this.service.saveDesignation(this.Designation).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Designation.DesignationId > 0) {
          this.toastr.success("Designation Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Designation added successfully")
          $('#staticBackdrop').modal('hide')

        }
        this.resetForm()
        form.resetForm();
        this.getDesignationList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteDesignation(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteDesignation(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getDesignationList()
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

  editDesignation(obj: any) {
    this.resetForm()
    this.Designation = obj
  }

}
