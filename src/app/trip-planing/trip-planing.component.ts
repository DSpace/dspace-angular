import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HeaderService } from '../commons/services/Header/header.service';
import { CategoryApiFacadeService } from '../commons/facade/category-api-facade.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { AlertComponent } from '../commons/components/alert/alert.component';
import * as _moment from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TripsFacadeApiService } from '../commons/facade/trips-facade-api.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../commons/services/sharedData/shared-data.service';


const moment = _moment;

@Component({
  selector: 'app-trip-planing',
  templateUrl: './trip-planing.component.html',
  styleUrls: ['./trip-planing.component.scss']
})
export class TripPlaningComponent implements OnInit {
  startpoint: any;
  destinationpoint: any;
  curruntStep = 1;
  totalSteps = 5;
  subModules: any;
  selectedSeason: any;
  selectedPeoplevalue: any;
  selectedBudget: any;
  currentvalue: any;
  selectedTransType: any;
  selectedDestTransType: any
  options: any;
  categories: any = [];
  //isDisabled: boolean = true;
  disabled: boolean = false;
  selectedCategory: any = [];
  subCategories: any;
  selectedSubCategory: any = [];
  showSubCategories: any;
  sDate = new FormControl();
  eDate = new FormControl();
  durationInSeconds = 5;
  minDate = moment().toDate();
  minEndDate: any;
  // formGroup: FormGroup;
  isDisabled: any = "select-box";
  isDisableddate: any = "date-band";
  selectedIndex: number = null;
  selectcategoryhideshow = false;
  selectedSubCategories: any[] = [];
  storeCateandsubcate: any = [];
  interests: any[] = [];
  progreessshow = false;
  HotelB: any;
  FlightB: any;
  TicketB: any;

  max1 = 100;
  min1 = 25;
  showTicks = true;
  step1 = 25;
  thumbLabel = false;
  value = 25;
  value1 = 25;
  value2 = 25;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  // horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  // verticalPosition: MatSnackBarVerticalPosition = 'bottom';



  constructor(private headerService: HeaderService,
    private categoryAPIFacadeService: CategoryApiFacadeService,
    private _snackBar: MatSnackBar,
    private tripsFacadeApiService: TripsFacadeApiService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private el: ElementRef, private renderer: Renderer2) {
    this.headerService.showHeader = true;
    this.headerService.hide = false;
  }

  ngOnInit(): void {
    this.categoryAPIFacadeService.categoryListGet().pipe().subscribe((data) => {
      if (data.status === 1) {
        this.categories = data.data;
      }
    });
    this.categoryAPIFacadeService.categorySubCategoryGet().pipe().subscribe((data) => {
      if (data.status === 1) {
        this.subCategories = data.data;
      }
    });

    this.startpoint = this.sharedDataService.getstartingpoint();
    this.destinationpoint = this.sharedDataService.getdestinationpoint();
    if (this.startpoint == undefined) {
      this.router.navigate(['/home']);
    }
  }




  onPlaceSelected(place: google.maps.places.PlaceResult) {
    console.log(place);
  }

  next() {
    if (this.curruntStep === 1) {
      if (this.selectedSeason === undefined && this.sDate.value === null && this.eDate.value === null) {
        this.openSnackBar();

      } else {
        this.curruntStep = this.totalSteps <= this.totalSteps ? this.curruntStep + 1 : this.totalSteps;
      }
    } else if (this.curruntStep === 2) {

      if (this.selectedPeoplevalue === undefined) {
        this.openSnackBar();
      } else {
        this.curruntStep = this.totalSteps <= this.totalSteps ? this.curruntStep + 1 : this.totalSteps;
      }

    } else if (this.curruntStep === 3) {

      if (this.selectedCategory.length == 0 && this.selectedSubCategory.length == 0) {
        this.openSnackBar();
      } else {
        this.curruntStep = this.totalSteps <= this.totalSteps ? this.curruntStep + 1 : this.totalSteps;
      }

    } else if (this.curruntStep === 4) {

      if (this.selectedBudget === undefined) {
        this.openSnackBar();
      } else {
        this.curruntStep = this.totalSteps <= this.totalSteps ? this.curruntStep + 1 : this.totalSteps;
      }
    }
    else if (this.curruntStep === 5) {
      if (this.selectedTransType == undefined) {
        this.openSnackBar();
      }
      else if (this.selectedDestTransType == undefined) {
        this.openSnackBar();
      }
      else {
        this.onSubmit();

      }

    }
  }

  previus() {
    this.curruntStep = this.curruntStep != 1 ? this.curruntStep - 1 : 1;
  }

  setSeason(value: any) {

    if (this.isDisableddate = "date-band disabled-btn") {
      this.isDisableddate = "date-band disabled-btn";
      this.sDate.setValue(null);
      this.eDate.setValue(null);
      this.isDisabled = "select-box";
      this.selectedSeason = value;
    }
    else {
      this.selectedSeason = value;
      this.sDate.setValue(null);
      this.eDate.setValue(null);
      this._value = 1;
      this._min = 1;
      this._max = 90;
      this.isDisableddate = "date-band disabled-btn";
    }
    //  this.selectedIndex = index;

    // alert(currentvalue);
  }

  setPeople(value: any) {
    this.selectedPeoplevalue = value;
  }

  setBudget(value: any) {
    this.selectedBudget = value;
    this.progreessshow = true;
  }
  setBudget1(value: any) {
    this.selectedBudget = value;
    this.progreessshow = false;
  }
  setBudget2(value: any) {
    this.selectedBudget = value;
    this.progreessshow = false;
  }
  setBudget3(value: any) {
    this.selectedBudget = value;
    this.progreessshow = false;
  }

  setTransportationType(value: any) {
    this.selectedTransType = value;
    if (this.selectedDestTransType && this.selectedTransType) {
      //this.onSubmit();
    }
  }

  setDestTransportationType(value: any) {
    this.selectedDestTransType = value;
    if (this.selectedDestTransType && this.selectedTransType) {
      //this.onSubmit();
    }
  }
  onSliderChange(event: Event): void {

    const sliderValue = (event.target as HTMLInputElement).value;

    this.HotelB = sliderValue;




  }
  onSliderChangeFlight(event: Event): void {

    const sliderValue = (event.target as HTMLInputElement).value;

    this.FlightB = sliderValue;
  }
  onSliderChangeTicket(event: Event): void {

    const sliderValue = (event.target as HTMLInputElement).value;
    this.TicketB = sliderValue;

  }

  onSubmit() {
    debugger;
    let data = {
      origin: this.startpoint,
      destination: this.destinationpoint,
      start_date: this.sDate.value === null ? '' : this.sDate.value,
      end_date: this.eDate.value === null ? '' : this.eDate.value,
      season: this.selectedSeason,
      trip_days: this._value,
      group_type:  this.selectedPeoplevalue,
      adults: this._familyAdults,
      childrens: this._familyChildren,
      mot: this.selectedTransType,
      reach_by_destination: this.selectedDestTransType,
      interests: this.interests,
      // interests: [{
      //   id: 1,
      //   name: 'Electronic',
      //   sub_interests: [
      //     {
      //       id: 1,
      //       name: 'Trimmer'
      //     }
      //   ]
      // }

      // ],
      budget: {
        overall: '1000$',
        hotel: '1000$',
        flight: '1000$',
        ticket: '1000$'
      },
      // budget: {
      //   overall: '1000$',
      //   hotel: this.HotelB,
      //   flight: this.FlightB,
      //   ticket: this.TicketB
      // },
    }
    console.log(data);
    this.tripsFacadeApiService.tripSearchPost(data).pipe().subscribe((data) => {
      if (data.status === 1) {
        this.sharedDataService.setSharedData(data);
        this.router.navigate(['/generating-itinerary']);
        console.log("search", data);
        //this.router.navigate(['/generating-itinerary']);
      }
    });
  }

  _value: number = 1;
  _step: number = 1;
  _min: number = 1;
  _max: number = 90;
  _wrap: boolean = false;
  _familyAdults: number = 1;
  _familyChildren: number = 0;


  @Input() set customActive(value: boolean) {
    if (value) {
      this.renderer.addClass(this.el.nativeElement, 'custom-active-class');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'custom-active-class');
    }
  }

  isCustomActive = false;

  updateSliderAndFillLine(steps: number): void {
    // Add any additional logic you need here
    this.isCustomActive = steps > 0;
  }


  myFormGroup = new FormGroup({
    formField: new FormControl()
  });


  @Input('value')
  set inputValue(_value: number) {
    this._value = this.parseNumber(_value);
  }




  @Input()
  set step(_step: number) {
    this._step = this.parseNumber(_step);
  }

  @Input()
  set min(_min: number) {
    this._min = this.parseNumber(_min);
  }

  @Input()
  set max(_max: number) {
    this._max = this.parseNumber(_max);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this._wrap = this.parseBoolean(_wrap);
  }

  private parseNumber(num: any): number {
    return +num;
  }

  private parseBoolean(bool: any): boolean {
    return !!bool;
  }

  // setColor(color: string): void {
  //   this.color = color;
  // }

  // getColor(): string {
  //   return this.color
  // }

  incrementValue(step: number = 1): void {

    let inputValue = this._value + step;

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    if (inputValue > 0) {
      this._value = inputValue;
    }


  }

  incrementValueadult(step: number = 1): void {
    debugger

    let inputValue = this._familyAdults + step;

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    if (inputValue > 0) {
      this._familyAdults = inputValue;
    }

  }

  incrementValuechildren(step: number = 0): void {
    debugger

    let inputValue = this._familyChildren + step;

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }
    if (inputValue > -1) {
      this._familyChildren = inputValue;
    }

  }

  private wrappedValue(inputValue): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {

      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

  shouldDisableDecrement(inputValue: number): boolean {
    debugger
    return !this._wrap && inputValue <= this._min;
  }

  shouldDisableIncrement(inputValue: number): boolean {
    debugger
    return !this._wrap && inputValue >= this._max;
  }

  showDiv = {
    previous: false,
    current: false,
    next: false
  }

  selectCategory(data: any) {

    this.selectedCategory = data;
    console.log('cat:', this.selectedCategory);
    this.selectcategoryhideshow = true;
    this.showSubCategories = this.subCategories.filter((data1: any) => data1.interest_category_id === data.id);
    this.storeCateandsubcate = {
      id: data.id,
      name: data.category_name,

      sub_interests: []
    };
  }

  isSelectedCategory(category: any): boolean {

    return (
      this.selectedCategory && this.selectedCategory.id === category.id ||
      this.interests.some((interest: any) => interest.id === category.id)
    );
  }



  isSelected(item: any): boolean {

    return this.selectedSubCategories.some(selectedItem => selectedItem.id === item.id);
  }



  selectSubCategory(item: any): void {
    const index = this.selectedSubCategories.findIndex(selectedItem => selectedItem.id === item.id);

    if (index === -1) {

      this.selectedSubCategories.push(item);
      this.selectedSubCategories = this.selectedSubCategories;

      this.storeCateandsubcate.sub_interests.push({
        id: item.id,
        name: item.category_name
      });
    } else {

      this.selectedSubCategories.splice(index, 1);
      const subInterestIndex = this.storeCateandsubcate.sub_interests.findIndex(subItem => subItem.id === item.id);
      if (subInterestIndex !== -1) {
        this.storeCateandsubcate.sub_interests.splice(subInterestIndex, 1);
      }
    }
  }



  backcategory() {
    this.selectcategoryhideshow = false;
  }

  Subcategorysave() {
    this.selectcategoryhideshow = false;
    this.interests.push(this.storeCateandsubcate);
    console.log(this.interests);
  }

  onDateSelection() {

    this.selectedSeason = '';
    this.isDisableddate = "date-band"
    if (this.sDate.value) {

      this.minEndDate = moment(this.sDate.value).toDate();
      this.isDisabled = "select-box disabled-btn"
    }
    if (this.sDate.value && this.eDate.value) {
      const startDateMoment = moment(this.sDate.value);
      const endDateMoment = moment(this.eDate.value);

      const dayDifference = endDateMoment.diff(startDateMoment, 'days');
      this._value = dayDifference;
      this._min = dayDifference;
      this._max = dayDifference;
      this.isDisabled = "select-box disabled-btn";
    }
  }

  openSnackBar() {
    this._snackBar.open('Plz fill required Values', 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }

}

