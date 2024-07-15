import { Component } from '@angular/core';
import { AppService } from '../utils/app.service';
import { ConstantData } from '../utils/constant-data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent {
  dataLoading = false;
  AllDptStaffList: any = [];
  DptStaffList: any = [];
  defaultDp = "../../assets/img/profile.png"
  baseUrl = this.service.getBaseUrl();

  constructor(
    private service: AppService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getDptStaffList();
    this.DptStaffList = [];
  }



  getDptStaffList() {
    var obj = {}
    this.dataLoading = true;
    this.service.getDptStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllDptStaffList = response.DptStaffList;
        this.AllDptStaffList.forEach((el:any) => {
            if (el.Show) {
              this.DptStaffList.push(el)
            }
        });
        
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      //this.toastr.error("Error while fetching records")
    }))
    this.dataLoading = false;
  }
}
