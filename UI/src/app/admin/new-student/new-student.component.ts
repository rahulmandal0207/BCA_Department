import { Component } from '@angular/core';
import { ConstantData } from '../../utils/constant-data';
import { AppService } from '../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../utils/local.service';
import { NgForm, NgModel } from '@angular/forms';
import { LoadDataService } from 'src/app/utils/load-data.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActionModel } from 'src/app/utils/interface';
declare var $: any;


@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudentComponent {
  dataLoading: boolean = false
  StudentList: any = []
  Student: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StaffDetails: any = {}
  SessionList: any = []
  GenderList: any = []
  CategoryList: any = []
  ReligionList: any = []
  BloodGroupList: any = []
  SelectedSession: any = {};

  defaultDp = "../../assets/img/graduation.png"

  baseUrl = this.service.getBaseUrl();

  PhotoFiles: FileList;
  fileToUpload: any;

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
    private loadData: LoadDataService,
    private router: Router,


  ) { }

  ngOnInit(): void {
    this.getStudentList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.getSessionList();
    this.getGenderList();
    this.getStateList();
    this.getCityList();
    this.getReligionList();
    this.getCategoryList();
    this.getBloodGroupList();
    this.Student.Status = 1
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
    this.Student = {}
    this.isSubmitted = false
    this.Student.Status = 1
    this.cCityList = []
    this.pCityList = []
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.StudentList.filter = filterValue.trim().toLowerCase();
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

  getStudentList() {

    this.dataLoading = true;
    this.service.getStudentList(this.SelectedSession).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentList = response.StudentList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveStudent(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Student.UpdatedBy = this.StaffDetails.StaffLoginId;
    this.Student.DOB = this.loadData.loadDateTime(this.Student.DOB);

    this.dataLoading = true;
    this.service.saveStudent(this.Student).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Student.StudentId > 0) {
          this.toastr.success("Student Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Student added successfully")
          $('#staticBackdrop').modal('hide')
          $('#sameAsCorr').removeAttr('checked');

        }
        this.resetForm()
        form.resetForm();
        this.getStudentList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteStudent(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteStudent(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStudentList()
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

  editStudent(obj: any) {
    this.resetForm();
    this.Student = obj;
    this.onStateChange(1);
    this.onStateChange(2);
  }

  StudentId: any;
  setStudentId(obj: any) {
    this.StudentId = obj.StudentId
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


  saveStudentDp() {
    this.isSubmitted = true;
    const formData: FormData = new FormData();
    formData.append("StudentId", this.StudentId.toString());
    formData.append("StaffPhoto", this.PhotoFiles[0])

    this.dataLoading = true;
    this.service.saveStudentDp(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round((100 * event.loader) / event.total);
        } else if (event instanceof HttpResponse) {
          let response = event.body as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success("One record created successfully.", "Success");

            $('#displayPic').val('');
            $('#dpModal').modal('hide');
            this.getStudentList();
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


  StateList: any = []
  AllCityList: any = []

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


  getCityList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getCityList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllCityList = response.CityList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  cCityList: any = []
  pCityList: any = []
  onStateChange(type: number) {
    if (type == 1) {
      this.cCityList = []
      this.AllCityList.forEach((element: any) => {
        if (element.StateId == this.Student.CorrespondenceStateId) {
          this.cCityList.push(element);
        }
      });
    }
    if (type == 2) {
      this.pCityList = []
      this.AllCityList.forEach((element: any) => {
        if (element.StateId == this.Student.PermanentStateId) {
          this.pCityList.push(element);
        }
      });
    }
  }


  sameAsCorrespondence(sameAsCorr: any) {
    if (sameAsCorr.checked) {
      this.Student.PermanentAddress = this.Student.CorrespondenceAddress
      this.Student.PermanentStateId = this.Student.CorrespondenceStateId
      this.Student.PermanentCityId = this.Student.CorrespondenceCityId
      this.Student.PermanentPinCode = this.Student.CorrespondencePinCode
      this.pCityList = this.cCityList;
    } else {

      this.Student.PermanentAddress = null
      this.Student.PermanentStateId = null
      this.Student.PermanentCityId = null
      this.Student.PermanentPinCode = null
      this.pCityList = null
    }
  }



  getCategoryList() {
    var obj = {}
    this.service.getCategoryList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.CategoryList = response.CategoryList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching Category records")
    }))
  }

  getReligionList() {
    var obj = {}
    this.service.getReligionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ReligionList = response.ReligionList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching Religion records")
    }))
  }

  getBloodGroupList() {
    var obj = {}
    this.service.getBloodGroupList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.BloodGroupList = response.BloodGroupList
      } else {
        this.toastr.error(response.Message)
      }
    }, (err => {
      this.toastr.error("Error while fetching BloodGroup records")
    }))
  }

}
