import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/utils/app.service';
import { ConstantData } from 'src/app/utils/constant-data';
import { LocalService } from 'src/app/utils/local.service';
declare var $: any;

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html',
  styleUrls: ['./admin-master.component.css']
})
export class AdminMasterComponent {

  hamClicked = false;
  ScreenWidth: any;
  ScreenHeight: any;
  currentUser: any;

  constructor(
    private localService: LocalService,
    private router: Router,
    private toastr: ToastrService,
    private service: AppService
  ) { }

  ngOnInit() {
    this.currentUser = this.localService.getEmployeeDetail();
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
    this.getUserMenuList();

    if (this.ScreenWidth <= 500) {
      this.hamClicked = true;
      this.toggleSideBar();
    }
  }

  MenuList: any[] = [];
  getUserMenuList() {
    var obj = {
      StaffLoginId: this.currentUser.StaffLoginId,
    }
    this.service.getUserMenuList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MenuList = response.MenuList;
        this.MenuList = this.MenuList.sort((a, b) => (a.MenuTitle < b.MenuTitle ? -1 : 1))
        this.MenuList.forEach((el: any) => {
          el.MenuList.sort((x: any, y: any) => (x.MenuTitle < y.MenuTitle ? -1 : 1))
        })
      } else {
        this.toastr.error(response.Message)
      }

    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }




  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
    this.hamClicked = false;

    this.toggleSideBar();
  }

  toggleSideBar() {
    if (this.ScreenWidth > 500) {
      $('#ad-main').show();
      if (this.hamClicked) {
        $('#aside').addClass('hidden')
        $('#ad-main').css('margin-left', '0')
        $('#ad-footer').css('margin-left', '0')
      } else {
        $('#aside').removeClass('hidden')
        $('#ad-main').css('margin-left', '300px')
        $('#ad-footer').css('margin-left', '300px')
      }
    } else {
      $('#ad-main').css('margin-left', '0')
      $('#ad-footer').css('margin-left', '0')
      if (this.hamClicked) {
        $('#aside').addClass('hidden')
        $('#ad-main').slideDown('fast')
      } else {
        $('#aside').removeClass('hidden')
        $('#ad-main').slideUp('fast');
      }
    }
    this.hamClicked = !this.hamClicked
  }

  checkAsdie() {
    if (this.ScreenWidth <= 500) {
      this.hamClicked = true;
      this.toggleSideBar();
      //$('.side-sub-link').hasClass('active').children('i.first').addClass('circle-fill')
    }
  }

  logOut() {
    this.localService.removeEmployeeDetail();
    this.router.navigate(['/']);
  }

  //@HostListener('window:unload', ['$event'])
  //onWindowUnload() {
  //  this.logOut();
  //}
  //@HostListener('window:beforeunload', ['$event'])
  //beforeunloadHandler(event: any) {
  //  event.preventDefault()
  //  event.returnValue = '';
  //  return false;
  //}



  @HostListener('window:keydown.esc', ['$event'])
  bigFont(event: KeyboardEvent) {
    event.preventDefault();
    $('#staticBackdrop').modal('hide')
  }

  @HostListener('window:keydown.Alt.n', ['$event'])
  bigFont1(event: KeyboardEvent) {
    event.preventDefault();
    $('#staticBackdrop').modal('show')
  }
}
