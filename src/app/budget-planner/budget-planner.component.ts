import { Component,OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HeaderService } from '../commons/services/Header/header.service';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Swiper, SwiperOptions, Virtual } from 'swiper';

@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss']
})
export class BudgetPlannerComponent {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
  }
  
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
        slidesPerView: 1.7,
      },
      991: {
        slidesPerView: 1.5,
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

  config02: SwiperOptions = {
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
        slidesPerView: 1.7,
      },
      991: {
        slidesPerView: 1.5,
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

  config03: SwiperOptions = {
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
        slidesPerView: 1.7,
      },
      991: {
        slidesPerView: 1.5,
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


}

