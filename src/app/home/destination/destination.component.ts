import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MatDialog } from '@angular/material/dialog';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  navbarfixed: boolean;

  constructor(private dialog: MatDialog,) {}

  
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

  slideNext(){
    this.swiper?.swiperRef.slideNext();
  }
  slidePrev(){
    this.swiper?.swiperRef.slidePrev();
  }

  openSearchModal() {
    const dialogRef = this.dialog.open(SearchModalComponent, {
      width: '400px', // Set the desired width
      // You can configure other options here, like data to pass to the modal component.
    });

  }
  

}
