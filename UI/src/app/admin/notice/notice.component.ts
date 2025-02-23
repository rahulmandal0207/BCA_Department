import { HttpEventType, HttpResponse } from '@angular/common/http';
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
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {
  dataLoading: boolean = false
  NoticeList: any = []
  Notice: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  baseUrl: any;

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
    this.getNoticeList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.baseUrl = this.service.getBaseUrl();
    this.Notice.Status = 1;
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
    this.Notice = {}
    this.isSubmitted = false
    this.Notice.Status = 1

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NoticeList.filter = filterValue.trim().toLowerCase();
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

  getNoticeList() {
    this.dataLoading = true;
    this.service.getNoticeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.NoticeList = response.NoticeList;

      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching Notice list");
      this.dataLoading = false;
    }))
  }

  NoticeFile: FileList;
  fileToUpload: any;
  setNoticeFile(event: any) {
    console.log(event)
    this.NoticeFile = event.target.files;
    this.fileToUpload = event.target.files.item(0);
    if (this.fileToUpload.type != 'application/pdf') {
      this.toastr.error("Invalid file format !!");
      this.fileToUpload = null;
      return;
    }
    if (this.fileToUpload.size > 1024000) {
      this.toastr.error("File size should be less than 1 MB.");
      this.fileToUpload = null;
    }
  }

  saveNotice(form: NgForm) {

    if (form.invalid) {
      this.toastr.warning("Fill all the required fields");
      return
    }

    if (this.Notice.NoticeId == null)
      this.Notice.NoticeId = 0;

    if (this.Notice.Status == null)
      this.Notice.Status = 1;

    this.isSubmitted = true;
    var formData: FormData = new FormData();
    formData.append("StaffLoginId", this.StaffDetails.StaffLoginId.toString());
    formData.append("NoticeId", this.Notice.NoticeId.toString());
    formData.append("NoticeTitle", this.Notice.NoticeTitle);
    formData.append("Notice", this.NoticeFile[0]);
    formData.append("Status", this.Notice.Status);

    this.dataLoading = true;
    this.service.saveNotice(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round((100 * event.loader) / event.total);
        } else if (event instanceof HttpResponse) {
          let response = event.body as any;
          if (response.Message == ConstantData.SuccessMessage) {
            if (this.Notice.NoticeId > 0) {
              this.toastr.success("Record Updated successfully", "Success")
            } else {
              this.toastr.success("One record created successfully.", "Success");
            }
            this.resetForm()
            $('#NoticeTitle').val('');
            $('#Notice').val('');
            $('#staticBackdrop').modal('hide');
            this.getNoticeList();
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
          this.toastr.error("Error Occured while fetching data.", "Error");
        }
        this.dataLoading = false;
      },
    }
    );
  }

  editNotice(obj: any) {
    this.resetForm()
    this.Notice = obj;
  }

  deleteNotice(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteNotice(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getNoticeList()
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

  updateStatus(item: any, event: any) {
    this.Notice.NoticeId = item.NoticeId;
    if (event.target.checked) {
      this.Notice.Status = 1
    } else {
      this.Notice.Status = 2
    }
    this.dataLoading = true;
    this.service.updateStatus(this.Notice).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Status Updated successfully","Success")
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error white updating", "Error")
    }))
    this.dataLoading = false;
  }

}
