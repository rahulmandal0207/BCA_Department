import { Component, HostListener } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
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
