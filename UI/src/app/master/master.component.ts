import { Component, HostListener } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent {
  ScreenWidth: any;
  ScreenHeight: any;

  ngOnInit() {
    //this.modifyheader();
    this.onWindowResize();
  }

  @HostListener('window:scroll', ['$event'])
  backToTopActive() {
    if (window.scrollY > 10) {
      $('.back-to-top').addClass("active")
    } else {
      $('.back-to-top').removeClass("active")
    }
  }

  backToTop() {
    window.scrollTo(0,0);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
  }

  toggleMobleNav() {
    if (this.ScreenWidth <= 500) {
      $('#navbar').toggleClass('navbar-mobile');
      $('.mobile-nav-toggle').toggleClass('bi-list')
      $('.mobile-nav-toggle').toggleClass('bi-x')
    } else {
      //console.log("PC")
    }
  }
  
}
