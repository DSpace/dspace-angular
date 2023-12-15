import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';
@Component({
  selector: 'app-trip-details-login',
  templateUrl: './trip-details-login.component.html',
  styleUrls: ['./trip-details-login.component.scss']
})
export class TripDetailsLoginComponent {
  isChecked:true;
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

  constructor(private headerService: HeaderService) {
    this.headerService.hide = true; // Hide the header in HomeComponent
  }

  openFlightContent(){
    // this.addFlightForm = false;
    this.showFlightForm = !this.showFlightForm;
  }
  openHotelContent(){
    // this.addHotelForm = false;
    this.showHotelForm = !this.showHotelForm;
  }
  openReplacePlaceContent(){
    // this.addHotelForm = false;
    this.showReplacePlace = !this.showReplacePlace;
  }

  onintlize() {
    this.addFlightForm = true;
    this.addHotelForm = true;
    this.addReplacePlace = true;
  }

  viewmap() {
    this.openmap = !this.openmap;
  }
  close() {
    this.openmap = false;
  }
}
