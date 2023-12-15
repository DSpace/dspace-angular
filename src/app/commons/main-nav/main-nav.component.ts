import { Component, HostListener, Input, OnInit } from '@angular/core';
import { HeaderService } from '../services/Header/header.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  @Input() fromHome: boolean = false;
  navbarfixed: boolean;
  openMenu: boolean = false;
  logincheck: any;
  FirstName: any;
  LastName: any;
  currentPage: string;

  constructor(public headerService: HeaderService,
    private auth: AuthService,
    private route: Router) {

  }
  ngOnInit(): void {

    this.logincheck = localStorage.getItem('loginavaliable') == null ? false : localStorage.getItem('loginavaliable') == "" ? false : localStorage.getItem('loginavaliable');
    this.FirstName = localStorage.getItem('userFirstName');
    this.LastName = localStorage.getItem('userLastName');
    this.auth.notifyLogin$.subscribe(() => {
      
      this.logincheck = localStorage.getItem('loginavaliable') == null ? false : localStorage.getItem('loginavaliable') == "" ? false : localStorage.getItem('loginavaliable');
      this.FirstName = localStorage.getItem('userFirstName');
      this.LastName = localStorage.getItem('userLastName');
    });
  }

  getFirstLetter(name: string): string {
    // Ensure name is not empty before extracting the first letter
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }
    return ''; // Handle empty name case
  }

  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 300) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }
  menu() {
    this.openMenu = !this.openMenu;
  }
  close() {
    this.openMenu = false;
  }

  logout() {
    this.auth.logout();
    this.auth.notifyLogin();
    // this.route.navigate(['/login']);
  }

  routeEvent(pageName: string) {
    console.log(pageName);
    this.currentPage = pageName;
  }
}
