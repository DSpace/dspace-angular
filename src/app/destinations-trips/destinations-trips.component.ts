import { Component, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-destinations-trips',
  templateUrl: './destinations-trips.component.html',
  styleUrls: ['./destinations-trips.component.scss']
})
export class DestinationsTripsComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
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
      slidesPerView: 1.1,
    },
    480: {
      slidesPerView: 1.1,
    },
    767: {
      slidesPerView: 1.1,
    },
    991: {
      slidesPerView: 1.1,
    },
    1024: {
      slidesPerView: 1.1,
    },
    1150: {
      slidesPerView: 1.1,
    },
    1200: {
      slidesPerView:1.3,
    },
    1300: {
      slidesPerView: 1.3,
    },
    1400: {
      slidesPerView: 1.3,
    }
  }
};

slideNext(){
  this.swiper?.swiperRef.slideNext();
}
slidePrev(){
  this.swiper?.swiperRef.slidePrev();
}

}
