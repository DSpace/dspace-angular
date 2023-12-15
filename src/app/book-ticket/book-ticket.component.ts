import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Navigation, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.scss']
})
export class BookTicketComponent {
  isChecked: true;
  selected: boolean = false;
  panelOpenState = false;
  sDate = new FormControl();
  eDate = new FormControl();
  durationInSeconds = 5;
  minDate = moment().toDate();
  minEndDate: any;
  tripData: any;
  totalPeople: number;
  destination:string;
  constructor(private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
    const navigation: Navigation = this.router.getCurrentNavigation();
    if (!!navigation) {
      debugger;
      this.tripData = navigation.extras.state.data;
      if (!!this.tripData.data) {
        this.sDate.patchValue(moment(this.tripData.data.search_term.start_date).toDate());
        this.eDate.patchValue(moment(this.tripData.data.search_term.end_date).toDate());
        this.totalPeople = this.tripData.data.search_term.adults+this.tripData.data.search_term.childrens;
        this.destination =this.tripData.data.search_term.destination;
      } else {
        this.sDate.patchValue(moment(this.tripData.search_term.start_date).toDate());
        this.eDate.patchValue(moment(this.tripData.search_term.end_date).toDate());
        this.totalPeople = this.tripData.search_term.adults+this.tripData.search_term.childrens;
        this.destination =this.tripData.search_term.destination;
      }

    }

  }
  onDateSelection() {
  }

  checkoutClick() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: this.tripData
      }
    };
    this.router.navigate(['/booking-details'], navigationExtras);
  }

}
