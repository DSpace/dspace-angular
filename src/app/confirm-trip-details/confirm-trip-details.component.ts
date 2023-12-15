import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild  } from '@angular/core';
import { DataEntryDialogService } from '../commons/services/data-entry-dialog/data-entry-dialog.service';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-confirm-trip-details',
  templateUrl: './confirm-trip-details.component.html',
  styleUrls: ['./confirm-trip-details.component.scss']
})
export class ConfirmTripDetailsComponent {
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
  addRequest = false;
  showRequest = false;
  showFiller = false;
  public sidebarShow: boolean = false;
  openmap: boolean = false;

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
  openRequestContent(){
    // this.addHotelForm = false;
    this.showRequest = !this.showReplacePlace;
  }

  onintlize() {
    this.addFlightForm = true;
    this.addHotelForm = true;
    this.addReplacePlace = true;
    this.addRequest = true;
  }

  constructor(
    public dataEntryDialogService: DataEntryDialogService,private headerService: HeaderService
  ) {
    this.headerService.hide = true; // Hide the header in HomeComponent
   }
   
  cancletrip(){
    this.dataEntryDialogService.CancelTripDailogComponent();
  }

  
  viewmap() {
    this.openmap = !this.openmap;
  }
  close() {
    this.openmap = false;
  }

}
