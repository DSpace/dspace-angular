import { Component , HostListener, Input } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-city-budget-details',
  templateUrl: './city-budget-details.component.html',
  styleUrls: ['./city-budget-details.component.scss']
})
export class CityBudgetDetailsComponent {
  isChecked:true;
  selected: boolean = false;
  panelOpenState = false;
  navbarfixed: boolean;
  constructor(
    private headerService: HeaderService
  ) { 
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
  }

  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 300) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }

}
