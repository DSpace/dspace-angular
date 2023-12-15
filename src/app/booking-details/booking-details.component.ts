import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule  } from '@angular/forms';
import { HeaderService } from '../commons/services/Header/header.service';
import { Navigation, Router } from '@angular/router';



@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent {
  firstFormGroup: any;
  secondFormGroup: any;
  thirdFormGroup:any;
  isChecked:true;
  selected: boolean = false;
  panelOpenState = false;
  tripData: any;
  travelerForm: FormGroup;
  totalPersons: number[] = [0,1];
 constructor(
    public fb : FormBuilder,private headerService: HeaderService,
    private router: Router,
  ){
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
    const navigation: Navigation = this.router.getCurrentNavigation();
    if (!!navigation) {
      debugger;
      this.tripData = navigation.extras.state.data;
      if (!!this.tripData.data) {
        // this.totalPersons = this.tripData.data.search_term.adults + this.tripData.data.search_term.childrens;
        this.totalPersons = Array.from({ length: this.tripData.data.search_term.adults + this.tripData.data.search_term.childrens }, (_, index) => index);
      } else {
        this.totalPersons = Array.from({ length: this.tripData.search_term.adults + this.tripData.search_term.childrens }, (_, index) => index);
      }
    }
  }


  
  // constructor(
  //   public fb : FormBuilder,private headerService: HeaderService
  // ) {
  //   this.headerService.hide = true; // Hide the header in HomeComponent
  //  }

  
  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrl: ['', Validators.required]
    });
    this.initForm();

  }

  initForm() {
    this.travelerForm = this.fb.group({});
    for (let i = 0; i < this.totalPersons.length; i++) {
      this.travelerForm.addControl(`firstName${i}`, this.fb.control('', Validators.required));
      this.travelerForm.addControl(`lastName${i}`, this.fb.control('', Validators.required));
      this.travelerForm.addControl(`gender${i}`, this.fb.control(''));
      this.travelerForm.addControl(`age${i}`, this.fb.control(''));
    }
  }
}


