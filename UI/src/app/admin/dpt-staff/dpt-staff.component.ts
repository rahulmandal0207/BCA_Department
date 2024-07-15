import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
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
  selector: 'app-dpt-staff',
  templateUrl: './dpt-staff.component.html',
  styleUrls: ['./dpt-staff.component.css']
})
export class DptStaffComponent {

  dataLoading: boolean = false
  DptStaffList: any = []
  DptStaff: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  DesignationList: any = []

  defaultDp = "../../assets/img/profile.png"
  baseUrl = this.service.getBaseUrl();

  PhotoFiles: FileList;
  fileToUpload: any;

  action: ActionModel = {} as ActionModel;


  @ViewChild("form") form: NgForm;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router,
  ) { }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }



  ngOnInit(): void {
    this.getDptStaffList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.getDesignationList();
    this.getGenderList();
    this.getStaffTypeList()
    this.validiateMenu()
  }


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

  resetForm() {
    this.DptStaff = {}
    this.isSubmitted = false
    this.DptStaff.Status = 1

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DptStaffList.filter = filterValue.trim().toLowerCase();
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
  GenderList: any = []
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
  StaffTypeList: any = []

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

  getDptStaffList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getDptStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.DptStaffList = response.DptStaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveDptStaff(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.DptStaff.UpdatedBy = this.StaffDetails.StaffLoginId;
    this.DptStaff.JoinDate = this.loadDataService.loadDateTime(this.DptStaff.JoinDate);
    this.DptStaff.DOB = this.loadDataService.loadDateTime(this.DptStaff.DOB);
    this.dataLoading = true;
    this.service.saveDptStaff(this.DptStaff).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.DptStaff.DptStaffId > 0) {
          this.toastr.success("DptStaff Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("DptStaff added successfully")
        }
        this.resetForm()
        form.resetForm();
        this.getDptStaffList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteDptStaff(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteDptStaff(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getDptStaffList()
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

  editDptStaff(obj: any) {
    this.resetForm()
    this.DptStaff = obj

  }

  StaffId: any;
  setDptStaffId(obj: any) {
    this.StaffId = obj.StaffId
    $('#dpModal').modal('show')
  }

  editDp(event: any) {

    this.PhotoFiles = event.target.files;
    this.fileToUpload = event.target.files.item(0);
    if (this.fileToUpload.type != 'image/png' && this.fileToUpload.type != 'image/jpg' && this.fileToUpload.type != 'image/jpeg') {
      this.toastr.error("Invalid file format !!");
      this.fileToUpload = null;
      return;
    }
    if (this.fileToUpload.size > 512000) {
      this.toastr.error("File size should be less than 500 KB.");
      this.fileToUpload = null;
    }
  }

  saveDp() {
    this.isSubmitted = true;
    const formData: FormData = new FormData();
    formData.append("StaffId", this.StaffId.toString());
    formData.append("StaffPhoto", this.PhotoFiles[0])

    this.dataLoading = true;
    this.service.saveDptDp(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round((100 * event.loader) / event.total);
        } else if (event instanceof HttpResponse) {
          let response = event.body as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success("One record created successfully.", "Success");

            $('#displayPic').val('');
            $('#dpModal').modal('hide');
            this.getDptStaffList();
          } else {
            this.toastr.error(response.Message);
            this.dataLoading = false;
          }
        }
      },
      error: (err: any) => {
        console.log(err);
        // this.progress = 0;
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error("Error Occured while fetching data.");
        }
        this.dataLoading = false;
      },
    }
    );
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

}
