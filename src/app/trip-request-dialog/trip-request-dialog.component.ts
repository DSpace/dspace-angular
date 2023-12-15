import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-trip-request-dialog',
  templateUrl: './trip-request-dialog.component.html',
  styleUrls: ['./trip-request-dialog.component.scss']
})
export class TripRequestDialogComponent {
  @Output() rightPaneInitlized = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<boolean>();


  ngAfterViewInit(): void {
    this.rightPaneInitlized.emit('');
  }

close(){
  console.log('Emmited');
  debugger;
  this.closePanel.emit(true);
}

}
