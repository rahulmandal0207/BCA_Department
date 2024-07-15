import { Component, HostListener } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css']
})
export class AdmissionComponent {

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
