import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto'
import { ConstantData } from '../utils/constant-data';
import { AppService } from '../utils/app.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent {
  dataLoading = false
  TopStudentList: any = []
  SessionList: any = []
  TopStudentSessionList: any = []

  constructor(
    private service: AppService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    $('#header').addClass('header-scrolled')
    this.topFive();
  }

  getTopStudentList(obj: any) {

    this.dataLoading = true;
    this.service.getTopStudentList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TopStudentList = response.TopStudentList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  topFive() {

    new Chart($('#barChart'), {
      type: 'bar',
      data: {
        labels: ['Rahul', 'Vivek', 'Adarsh', 'Ankit', 'Ashwani'],
        datasets: [{
          label: 'CGPA',
          data: [6, 5, 8, 8.1, 5.6],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
          }
        }
      }
    });

  }

}
