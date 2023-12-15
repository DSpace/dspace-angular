import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';
import { SharedDataService } from '../commons/services/sharedData/shared-data.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TripsFacadeApiService } from '../commons/facade/trips-facade-api.service';
@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  infoContent = '';
  isChecked: true;
  selected: boolean = false;
  panelOpenState = false;
  editId: number;
  showFlightForm = false;
  addFlightForm = false;
  showHotelForm = false;
  addHotelForm = false;
  showReplacePlace = false;
  addReplacePlace = false;
  showFiller = false;
  public sidebarShow: boolean = false;
  openmap: boolean = false;
  navbarfixedtop: boolean = false;
  tripactionbox: boolean = false;
  BindDataSearch: any = [];
  search_term: any = [];
  itinerary: any = [];
  Savetrip: any = [];
  IsSave: boolean = false;
  TripId: any;
  isFavourite = false;
  /*Map Config */
  markers: any = [];
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    //mapTypeId: 'hybrid',
    // zoomControl: false,
    // scrollwheel: false,
    //disableDoubleClickZoom: true,
    // maxZoom: 15,
    // minZoom: 8,
  };
  /*Map Config */

  constructor(private headerService: HeaderService,
    public SharedDataService: SharedDataService, private router: Router, public tripsFacadeApiService: TripsFacadeApiService,
    private route: ActivatedRoute) {
    this.headerService.hide = true;



  }



  ngOnInit(): void {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.center = {
    //     lat: 34.083656,
    //     lng: 74.797371,
    //   };
    // });



    this.BindDetails();
  }




  openFlightContent() {
    // this.addFlightForm = false;
    this.showFlightForm = !this.showFlightForm;
  }
  openHotelContent() {
    // this.addHotelForm = false;
    this.showHotelForm = !this.showHotelForm;
  }
  openReplacePlaceContent() {
    // this.addHotelForm = false;
    this.showReplacePlace = !this.showReplacePlace;
  }

  onintlize() {
    this.addFlightForm = true;
    this.addHotelForm = true;
    this.addReplacePlace = true;
  }
  lo: any;
  lat: any;
  mapset(ac) {
    debugger
    this.lo = ac.longitude;
    this.lat = ac.latitude;
    var activity = ac.activity;
    var rating = ac.rating;
    this.addMarker(this.lat, this.lo, activity);
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: Number(this.lat),
        lng: Number(this.lo),
      };
    });
  }
  viewmap() {
    this.openmap = !this.openmap;
  }
  close() {
    this.openmap = false;
  }

  @HostListener('window:scroll', ['$event']) onscrolltop() {
    if (window.scrollY > 100) {
      this.tripactionbox = true;
    }
    else {
      this.tripactionbox = false;
    }
  }


  @HostListener('window:scroll', ['$event']) onscrollbottom() {
    if (window.scrollY > 100) {
      this.navbarfixedtop = true;
    }
    else {
      this.navbarfixedtop = false;
    }
  }

  BindDetails() {
    if (this.route.snapshot.paramMap.get('id') === '0') {
      this.BindDataSearch = this.SharedDataService.getSharedData();
      if (this.BindDataSearch != undefined) {
        this.search_term = this.BindDataSearch.data.search_term;
        this.itinerary = this.BindDataSearch.data.itinerary;
        if (this.itinerary.length > 0) {
          for (let i = 0; i < this.itinerary.length; i++) {
            for (let j = 0; j < this.itinerary[i].activities.length; j++) {
              this.lat = this.itinerary[i].activities[j].latitude;
              this.lo = this.itinerary[i].activities[j].longitude;
              var activity = this.itinerary[i].activities[j].activity
              //console.log(lat,long);
              //this.addMarker(lat,long,activity);
              this.addMarker(this.lat, this.lo, activity);
              navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                  lat: Number(this.itinerary[0].activities[0].latitude),
                  lng: Number(this.itinerary[0].activities[0].longitude),
                };
              });

            }
          }
        }
      }
    } else {
      this.tripsFacadeApiService.tripTripIdGet(this.route.snapshot.paramMap.get('id')).pipe().subscribe((response: any) => {
        if (response.status === 1) {
          this.IsSave = true;
          this.BindDataSearch = response.data;
          this.search_term = response.data.search_term;
          this.itinerary = response.data.itinerary;
          if (this.itinerary.length > 0) {
            for (let i = 0; i < this.itinerary.length; i++) {
              for (let j = 0; j < this.itinerary[i].activities.length; j++) {
                this.lat = this.itinerary[i].activities[j].latitude;
                this.lo = this.itinerary[i].activities[j].longitude;
                var activity = this.itinerary[i].activities[j].activity
                //console.log(lat,long);
                //this.addMarker(lat,long,activity);
                this.addMarker(this.lat, this.lo, activity);
                navigator.geolocation.getCurrentPosition((position) => {
                  this.center = {
                    lat: Number(this.itinerary[0].activities[0].latitude),
                    lng: Number(this.itinerary[0].activities[0].longitude),
                  };
                });

              }
            }
          }
        }
      })
    }
  }

  addMarker(lat: number, lng: number, activity: any) {
    // navigator.geolocation.getCurrentPosition((position) => {
    //             this.center = {
    //               lat: Number(this.itinerary[0].activities[0].latitude),
    //               lng: Number(this.itinerary[0].activities[0].longitude),
    //             };
    //           });
    this.markers.push({
      position: {
        lat: Number(lat),
        lng: Number(lng),
      },
      label: {
        color: 'red',
        text: 'Marker label',
      },
      title: activity,
      options: { animation: google.maps.Animation.DROP },
    });
    console.log("markers", this.markers);
  }
  openInfo(marker: MapMarker) {
    //this.infoContent = "Srinagar";
    this.infoWindow.open(marker);
  }

  savedata() {
    if (!localStorage.getItem('user_id')) {
      this.router.navigate(['/login']);
      return;
    }
    let data = {
      user_id: localStorage.getItem('user_id') == null ? 0 : localStorage.getItem('user_id'),
      search_term: this.search_term,
      itinerary: this.itinerary,
      is_public: 1
    }

    this.Savetrip = data;
    console.log("savedata", this.Savetrip);
    //this.fdata = data;
    //this.router.navigate(['/my-trips']);
    this.tripsFacadeApiService.tripPost(this.Savetrip).pipe().subscribe((data) => {
      if (data.status === 1) {
        this.IsSave = true;
        console.log("tripsatatus", data);
        this.TripId = data.data.id;
        // this.sharedDataService.setSharedData(data);
        //this.router.navigate(['/generating-itinerary']);
      }
      else if (data.status === 0) {
        this.IsSave = false;
      }
    });
  }

  toggleFavourite() {
    this.isFavourite = !this.isFavourite;
    console.log(this.isFavourite);

    this.tripsFacadeApiService.tripsFavoriteTripIdPost(this.TripId).pipe().subscribe((data) => {
      if (data.status === 1) {
        //this.mytrip = data.data.trips;
        console.log(data);
      }

    });
  }

  bookTicket() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: this.BindDataSearch
      }
    };
    this.router.navigate(['/book-ticket'], navigationExtras);
  }
}
