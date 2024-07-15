import { Component } from '@angular/core';
import { ConstantData } from '../../utils/constant-data';
import { AppService } from '../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../utils/local.service';
import { NgForm } from '@angular/forms';
import { ActionModel } from 'src/app/utils/interface';
import { Router } from '@angular/router';
import { LoadDataService } from 'src/app/utils/load-data.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  dataLoading: boolean = false
  NotesList: any = []
  Notes: any = {}
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
  baseUrl: any ;


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
    this.getNotesList();
    this.getStatusList();
    this.StaffDetails = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSubjectList();
    this.baseUrl = this.service.getBaseUrl();
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
    this.Notes = {}
    this.isSubmitted = false
    this.Notes.Status = 1
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NotesList.filter = filterValue.trim().toLowerCase();
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

  getNotesList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getNotesList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.NotesList = response.NotesList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  NotesFile: FileList;
  fileToUpload: any;
  setNotesFile(event: any) {
    console.log(event)
    this.NotesFile = event.target.files;
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

  saveNotes(form: NgForm) {

    if (form.invalid) {
      this.toastr.warning("Fill all the required fields");
      return
    }

    if (this.Notes.NotesId == null)
      this.Notes.NotesId = 0;

    if (this.Notes.Status == null)
      this.Notes.Status = 1;

    this.isSubmitted = true;
    var formData: FormData = new FormData();
    formData.append("UploadedBy", this.StaffDetails.StaffLoginId.toString());
    formData.append("NotesId", this.Notes.NotesId.toString());
    formData.append("NotesTitle", this.Notes.NotesTitle);
    formData.append("Notes", this.NotesFile[0]);
    formData.append("Author", this.Notes.Author);
    formData.append("Status", this.Notes.Status);

    this.dataLoading = true;
    this.service.saveNotes(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round((100 * event.loader) / event.total);
        } else if (event instanceof HttpResponse) {
          let response = event.body as any;
          if (response.Message == ConstantData.SuccessMessage) {
            if (this.Notes.NotesId > 0) {
              this.toastr.success("Record Updated successfully", "Success")
            } else {
              this.toastr.success("One record created successfully.", "Success");
            }
            this.resetForm()
            $('#NotesTitle').val('');
            $('#Notes').val('');
            $('#staticBackdrop').modal('hide');
            this.getNotesList();
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

  deleteNotes(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      this.dataLoading = true;
      this.service.deleteNotes(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getNotesList()
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

  editNotes(obj: any) {
    this.resetForm()
    this.Notes = obj
  }

  AllSubjectList: any = []
  SubjectList: any = []
  getSubjectList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getSubjectList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSubjectList = response.SubjectList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  filterSubjectList(value: any) {
    console.log(value)
    if (value) {
      this.SubjectList = this.AllSubjectList.filter((option: any) => option.SubjectName.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.SubjectList = this.AllSubjectList;
    }
  }
}
