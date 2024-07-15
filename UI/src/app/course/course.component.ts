import { Component, HostListener } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  preloader = false;
  ngOnInit() {
    $('#header').addClass('header-scrolled')
    this.preloader = true;
    window.scrollTo(0,0)
  }

  ngAfterViewInit() {
    this.preloader = false;
  }

  @HostListener('window:load', ['$event'])
  removePreloader() {
    $('#preloader').remove();
  }
}
