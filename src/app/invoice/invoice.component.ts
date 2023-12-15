import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HeaderService } from '../commons/services/Header/header.service';




export interface PeriodicElement {
  name: string;
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', },
];

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent{
  @Input() id: number;
  @Input() type: string;

  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;


 
  constructor(public fb: FormBuilder,private headerService: HeaderService) 
  {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
  }
}