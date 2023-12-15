import { Component , HostListener, OnInit, ViewChild } from '@angular/core';
import { DataEntryDialogService } from '../commons/services/data-entry-dialog/data-entry-dialog.service';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Swiper, SwiperOptions, Virtual } from 'swiper';
import { HeaderService } from '../commons/services/Header/header.service';
import { TripsFacadeApiService } from '../commons/facade/trips-facade-api.service';
import { Router } from '@angular/router';

// install Swiper modules
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})

export class FeedsComponent {
  trips: any[] = [];
  totalTrips:any;
  page:number = 1;
  itemsPerPage:number = 3;
  maxPage:any = 1;
  user_id : any;
  
  constructor(
    public dataEntryDialogService: DataEntryDialogService,private headerService: HeaderService,
    private tripsFacadeApiService : TripsFacadeApiService,
    private router : Router
  ) { 
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
    this.loadData();
  }


  ngOnInit()
  {
    this.user_id = localStorage.getItem('user_id') == null ? 0 : localStorage.getItem('user_id');
  }

  loadData() {
   
    if (this.maxPage >= this.page) {
      this.tripsFacadeApiService.tripsPublicGet(this.page, this.itemsPerPage).pipe().subscribe((response) => {
        console.log(response);
        this.totalTrips = response.data.total;
        this.maxPage = Math.ceil(this.totalTrips / this.itemsPerPage);
        this.trips = this.trips.concat(response.data.trips);
        
        this.page++;
      });
    }

  }

  onScroll() {
    this.loadData();
  }
  requestJoin(tripid : any){
    this.dataEntryDialogService.openSignDialogComponent(tripid).afterClosed().subscribe(result => {
      this.loadData();
      console.log("afterclose",tripid);
     });
   
  }
 
    
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  
    config: SwiperOptions = {
    observer: false,
    slidesPerView: 4,
    spaceBetween: 10,
    navigation: false,
    loop: false,
    lazy: true,
    autoplay:true,
    centeredSlides : false,

    breakpoints: {
      300: {
        slidesPerView: 1.2,
      },
      480: {
        slidesPerView: 1.2,
      },
      767: {
        slidesPerView: 1.2,
      },
      991: {
        slidesPerView: 2.2,
      },
      1024: {
        slidesPerView: 2.5,
      },
      1150: {
        slidesPerView: 2.5,
      },
      1200: {
        slidesPerView:2.5,
      },
      1300: {
        slidesPerView: 2.5,
      },
      1400: {
        slidesPerView: 2.5,
      }
    }
  };

  slideNext(){
    this.swiper?.swiperRef.slideNext();
  }
  slidePrev(){
    this.swiper?.swiperRef.slidePrev();
  }
  activityClick(activity:any) {
    debugger;
    console.log(activity);
    this.router.navigate(['/trip-details/' + activity.id]);  
  }
  massegeClick(trip) {
    
  }
}
