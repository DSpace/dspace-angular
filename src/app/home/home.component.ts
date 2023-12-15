import { Component , ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Swiper, SwiperOptions, Virtual } from 'swiper';
import { HeaderService } from '../commons/services/Header/header.service';
import { DataEntryDialogService } from '../commons/services/data-entry-dialog/data-entry-dialog.service';
import { outputs } from '@syncfusion/ej2-angular-richtexteditor/src/rich-text-editor/richtexteditor.component';
import { GooglePlacesSearchComponent } from '../commons/google-places-search/google-places-search.component';
import { Router } from '@angular/router';
import { SharedDataService } from '../commons/services/sharedData/shared-data.service';
import Swal from 'sweetalert2';
// install Swiper modules
SwiperCore.use([Virtual]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() placeSelected = new EventEmitter<string>();
  @Input() DestinationPoint: string;
  @Input() Startingpoint: string;

 

  searchFormControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  navbarfixed: boolean;
  formControl = new FormControl();
  placeName : any = [];




  onPlaceSelected(place: google.maps.places.PlaceResult) {
   
    this.placeName = place;
    this.Startingpoint = place.formatted_address; 
    this.SharedDataService.setstartingpoint(this.Startingpoint);

  }

  onPlaceSelected1(place: google.maps.places.PlaceResult) {
    this.placeName = place;
    this.DestinationPoint = place.formatted_address;
    this.SharedDataService.setdestinationpoint(this.DestinationPoint); 
  
   }

  constructor(
     public dataEntryDialogService: DataEntryDialogService,
     public fb: FormBuilder,
     private headerService: HeaderService,
     private route: Router,
     public SharedDataService : SharedDataService
  ) { 
    this.headerService.showHeader = false;
    this.headerService.hide = false;
  }

  openshare(){
    this.dataEntryDialogService.openShareDialogComponent();
  }
 
  ngOnInit() {
  
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;


  @HostListener('window:scroll',['$event']) onscroll(){
    if(window.scrollY > 100)
    {
      this.navbarfixed = true;
    }
    else
    {
      this.navbarfixed = false;
    }
  }

  destinations: SwiperOptions = {
    observer: false,
    slidesPerView: 2.2,
    spaceBetween: 20,
    navigation: false,
    loop: false,
    lazy: true,
    autoplay:true,
    centeredSlides : false,
    breakpoints: {
      480: {
        slidesPerView: 2.2,
      },
      767: {
        slidesPerView: 3.5,
      },
      991: {
        slidesPerView: 3.5,
      },
      1024: {
        slidesPerView: 3.5,
      },
      1150: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView:4,
      },
      1300: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 4,
      }
    }
  };

  slideNext01(){
    this.swiper?.swiperRef.slideNext();
  }
  slidePrev01(){
    this.swiper?.swiperRef.slidePrev();
  }

  starttrip(){
   
    if(this.Startingpoint != undefined && this.DestinationPoint != undefined){
      this.route.navigate(['/trip-plan']);
    }
    else{
      Swal.fire({
       
        text: "Please select both starting and destination point",
        icon: "error"
      });
      
    }
    }
  handleAddressChange(address: any) {
    debugger
    var userLatitude = address.geometry.location.lat();
    var userLongitude = address.geometry.location.lng();

    console.log('Selected location:', address);
    //this.locationlat = JSON.stringify(userLatitude);
   // this.locationlog = JSON.stringify(userLongitude);
    //this.username = address.formatted_address;
  }

  config01: SwiperOptions = {
    observer: false,
    slidesPerView: 1.7,
    spaceBetween: 20,
    navigation: false,
    loop: false,
    lazy: true,
    autoplay:true,
    centeredSlides : false,

    breakpoints: {
      480: {
        slidesPerView: 1.7,
      },
      767: {
        slidesPerView: 2.5,
      },
      991: {
        slidesPerView: 2.5,
      },
      1024: {
        slidesPerView: 3,
      },
      1150: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView:4,
      },
      1300: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 4,
      }
    }
  };

  // slideNext(){
  //   this.swiper?.swiperRef.slideNext();
  // }
  // slidePrev(){
  //   this.swiper?.swiperRef.slidePrev();
  // }


  
}