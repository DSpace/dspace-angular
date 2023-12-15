import { Component, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-discover-place',
  templateUrl: './discover-place.component.html',
  styleUrls: ['./discover-place.component.scss']
})
export class DiscoverPlaceComponent {
  config: SwiperOptions = {
    observer: false,
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: false,
    loop: false,
    lazy: true,
    autoplay:true,
    centeredSlides : false,

    breakpoints: {
      480: {
        slidesPerView: 1
      },
      767: {
        slidesPerView: 2,
      },
      991: {
        slidesPerView: 3,
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
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  slideNext(){
    this.swiper?.swiperRef.slideNext();
  }

  slidePrev(){
    this.swiper?.swiperRef.slidePrev();
  }
}
