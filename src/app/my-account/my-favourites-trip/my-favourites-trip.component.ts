import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripsFacadeApiService } from 'src/app/commons/facade/trips-facade-api.service';

@Component({
  selector: 'app-my-favourites-trip',
  templateUrl: './my-favourites-trip.component.html',
  styleUrls: ['./my-favourites-trip.component.scss']
})
export class MyFavouritesTripComponent implements OnInit {
  Fmytrip: any = [];
  first_name: string = '';
  isFavourite = true;


  constructor(
    public tripsFacadeApiService: TripsFacadeApiService,
    private route: Router) {

  }

  ngOnInit() {
    this.first_name = localStorage.getItem('userFirstName');
    this.favourites();
  }

  favourites() {
    this.tripsFacadeApiService.tripsFavoriteGet(1, 20).pipe().subscribe((data) => {
      if (data.status === 1) {
        this.Fmytrip = data.data.trips;
  
      }
      else{
        this.Fmytrip = [];
      }
    },
      (error) => {
        this.route.navigate(['/login']);
        // Handle the error here, for example, redirect to an error page or show a message to the user.
      }
    );
  }

  getFirstLetter(name: string): string {
    // Ensure name is not empty before extracting the first letter
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }
    return ''; // Handle empty name case
  }

  toggleFavourite(id : any) {
    debugger
    this.isFavourite = !this.isFavourite;
    console.log(this.isFavourite);
   
      this.tripsFacadeApiService.tripsFavoriteTripIdPost(id).pipe().subscribe((data) => {
        if (data.status === 1) {
          //this.mytrip = data.data.trips;
          console.log(data);
        }

      });
    


  }

}
