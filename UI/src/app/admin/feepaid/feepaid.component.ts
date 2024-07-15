import { Component } from '@angular/core';
import { ConstantData } from '../../utils/constant-data';
import { AppService } from '../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../utils/local.service';
import { NgForm } from '@angular/forms';
import { LoadDataService } from 'src/app/utils/load-data.service';
import { Router } from '@angular/router';
import { ActionModel } from 'src/app/utils/interface';
declare var $: any;

@Component({
  selector: 'app-feepaid',
  templateUrl: './feepaid.component.html',
  styleUrls: ['./feepaid.component.css']
})
export class FeepaidComponent {
  dataLoading: boolean = false
  FeePaidList: any = []
  FeePaid: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  SelectedSession: any = {};
  SessionList: any = []
  StudentList: any = []
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

    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.getSessionList();
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
    this.FeePaid = {}
    this.isSubmitted = false
    this.FeePaid.Status = 1
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FeePaidList.filter = filterValue.trim().toLowerCase();
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

  getFeePaidList() {
    this.dataLoading = true;
    this.service.getFeePaidList(this.SelectedSession).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaidList = response.FeePaidList;
        console.log(this.FeePaidList)
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveFeePaid() {
    this.isSubmitted = true
    //this.FeePaidList.UpdatedBy = this.StaffDetails.StaffLoginId; 
    this.FeePaidList.forEach((el: any) => {
      el.UpdatedBy = this.StaffDetails.StaffLoginId;
    });

    this.dataLoading = true;
    console.log(this.FeePaidList);
    this.service.saveFeePaid(this.FeePaidList).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {

        this.toastr.success("FeePaid Updated successfully")
        this.resetForm()
        this.getFeePaidList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }


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



}
