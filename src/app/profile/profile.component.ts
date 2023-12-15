import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  showProfile: boolean = true;
  showUpComingTrips: boolean = false;
  showBookdeTrips: boolean = false;
  showCompanions: boolean = false;
  showPaymentDetails: boolean = false;
  showFavouritesTrip: boolean = false;
  showSettings: boolean = false;
  isMobile: boolean = false;
  viewMenu: boolean = false

  myProfileClick() {
    this.closeAllExcept('showProfile');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
   }
  upcomingTripsClick() {
    this.closeAllExcept('showUpComingTrips');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
   }
  bookedTripsClick() {
    this.closeAllExcept('showBookdeTrips');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
   }
  companionsClick() { 
    this.closeAllExcept('showCompanions');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
  }
  paymentClick() { 
    this.closeAllExcept('showPaymentDetails');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
  }
  favouriteTripsClick() { 
    this.closeAllExcept('showFavouritesTrip');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
  }
  settingsClick() {
    this.closeAllExcept('showSettings');
    if(!!this.isMobile) {
      this.viewMenu = true;
    }
   }

  closeAllExcept(exceptComponent: string): void {
    // Close all components except the specified one
    this.showProfile = false;
    this.showUpComingTrips = false;
    this.showBookdeTrips = false;
    this.showCompanions = false;
    this.showPaymentDetails = false;
    this.showFavouritesTrip = false;
    this.showSettings = false;

    // Set the specified component to open
    this[exceptComponent] = true;
  }
  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.detectMobileView();
  }
  detectMobileView() {
    // Check the viewport width to determine if it's a mobile view
    const isMobileView = window.innerWidth < 992; // Adjust the value as needed

    if (isMobileView) {
      // Your mobile view-specific code here
      this.isMobile = true;
      console.log('Mobile view detected');
    } else {
      this.isMobile = false;
      // Your non-mobile view-specific code here
      console.log('Desktop view detected');
    }
  }
}
