import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/utils/app.service';
import { ConstantData } from 'src/app/utils/constant-data';
import { LocalService } from 'src/app/utils/local.service';
import Chart from 'chart.js/auto'
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dataLoading = false;
  currentUser: any;
  chart = null;
  TotalStudents: any;
  Gender: any = []
  Religion: any = []

  ngOnInit() {
    this.currentUser = this.local.getEmployeeDetail();
    this.getStudentsUtils();

  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private local: LocalService,
  ) { }

  getStudentsUtils() {
    this.dataLoading = true;
    this.service.getStudentUtilsList({}).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TotalStudents = response.TotalStudents;
        this.Gender.Male = response.Male;
        this.Gender.Female = response.Female;
        this.Gender.Others = response.Others;

        this.Religion.Hinduism = response.Hinduism;
        this.Religion.Islam = response.Islam;
        this.Religion.Christianity = response.Christianity;
        this.Religion.Sikhism = response.Sikhism;
        this.Religion.Buddhism = response.Buddhism;
        this.Religion.Jainism = response.Jainism;
        this.Religion.Tribal = response.Tribal;
        this.Religion.Others = response.Others;

        this.pieGender(this.Gender);
        this.pieReligion(this.Religion);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  pieGender(Gender: any) {
    new Chart($('#pieGender'), {
      type: 'pie',
      data: {
        labels: [
          'Male',
          'Female',
          'Others'
        ],
        datasets: [{
          label: 'Gender',
          data: [Gender.Male, Gender.Female, Gender.Others],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 9
        }]
      }
    });
  }

  pieReligion(Religion: any) {
    new Chart($('#pieReligion'), {
      type: 'pie',
      data: {
        labels: [
          'Hinduism',
          'Islam',
          'Christianity',
          'Sikhism',
          'Buddhism',
          'Jainism',
          'Tribal',
          'Others'
        ],
        datasets: [{
          label: 'Religion',
          data: [Religion.Hinduism, Religion.Islam, Religion.Christianity, Religion.Sikhism, Religion.Buddhism, Religion.Jainism, Religion.Tribal, Religion.Others],
          backgroundColor: [
            'rgb(243, 156, 18)',
            'rgb(46, 204, 113)',
            'rgb(211, 84, 0)',
            'rgb(41, 128, 185)',
            'rgb(241, 196, 15)',
            'rgb(231, 76, 60)',
            'rgb(142, 68, 173)',
            'rgb(127, 140, 141)',
          ],
          hoverOffset: 9
        }]
      }
    });
  }


}
