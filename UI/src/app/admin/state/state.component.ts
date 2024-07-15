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
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent {

  dataLoading: boolean = false
  StateList: any = []
  State: any = {}
  isSubmitted = false
  StatusList: any[] = []
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
    this.getStateList();
    this.getStatusList();
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

  resetForm() {
    this.State = {}
    this.isSubmitted = false
    this.State.Status = 1

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.StateList.filter = filterValue.trim().toLowerCase();
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

  getStateList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getStateList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StateList = response.StateList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveState(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.State.UpdatedBy = this.StaffDetails.StaffLoginId;

    this.dataLoading = true;
    this.service.saveState(this.State).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.State.StateId > 0) {
          this.toastr.success("State Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("State added successfully")
        }
        this.resetForm()
        form.resetForm();
        this.getStateList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteState(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteState(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStateList()
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

  editState(obj: any) {
    this.resetForm()
    this.State = obj
  }

}
