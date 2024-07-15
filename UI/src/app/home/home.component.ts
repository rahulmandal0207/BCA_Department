import { Component, HostListener } from '@angular/core';
import { AppService } from '../utils/app.service';
import { ConstantData } from '../utils/constant-data';
declare var particlesJS: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  preloader = false;
  baseUrl: any;

  constructor(
    private servie: AppService,

  ) { }

  ngOnInit() {
    this.modifyheader();
    window.scrollTo(0, 0)
    this.getNoticeList();
    this.baseUrl = this.servie.getBaseUrl();
    this.preloader = true;
    this.particlesInit();

  }


  @HostListener('window:load', ['$event'])
  removePreloader() {
    //this.preloader = false;

  }



  @HostListener('window:scroll', ['$event'])
  modifyheader() {
    if (window.scrollY > 100) {
      $('#header').addClass('header-scrolled')
    } else {
      $('#header').removeClass('header-scrolled')
    }
  }

  ActiveNoticeList: any = []
  NoticeList: any = [];
  getNoticeList() {
    this.servie.getNoticeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.NoticeList = response.NoticeList;
        this.NoticeList.forEach((element: any) => {
          if (element.Status == 1) {
            this.ActiveNoticeList.push(element)
          }
        });
      }
    })
  }


  particlesInit() {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 200,
          "density": {
            "enable": true,
            "value_area": 2000
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#00000000"
          },
          "polygon": {
            "nb_sides": 3
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 2,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 1,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });

  }



}
