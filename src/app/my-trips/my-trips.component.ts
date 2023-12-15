import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';
import { TripsFacadeApiService } from '../commons/facade/trips-facade-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {


  first_name: string = '';
  page: number = 1;
  itemsPerPage: number = 8;
  maxPage: any = 1;
  mytrip: any[] = [];
  totalmytrip: any;

  constructor(private headerService: HeaderService,
    public tripsFacadeApiService: TripsFacadeApiService,
    private route: Router) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
  }

  ngOnInit() {
    this.first_name = localStorage.getItem('userFirstName');
    this.MytripList();
  }

  MytripList() {
    if (this.maxPage >= this.page) {
      this.tripsFacadeApiService.tripsSelfGet(this.page, this.itemsPerPage).pipe().subscribe((response) => {
        if (response.status === 1) {
          //this.mytrip = response.data.trips;
          this.totalmytrip = response.data.total;
          this.maxPage = Math.ceil(this.totalmytrip / this.itemsPerPage);
          this.mytrip = this.mytrip.concat(response.data.trips);

          this.page++;
        }

      },
        (error) => {
          this.route.navigate(['/login']);
          // Handle the error here, for example, redirect to an error page or show a message to the user.
        }
      );
    }

  }

  getFirstLetter(name: string): string {
    // Ensure name is not empty before extracting the first letter
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }
    return ''; // Handle empty name case
  }

  onScroll() {
    this.MytripList();
  }

  activityClick(activity: any) {
    console.log(activity);
    this.route.navigate(['/trip-details/' + activity.id]);
  }
}
