import { Component, OnInit, Input } from '@angular/core';
import { Row } from '../../../core/layout/models/tab.model';

@Component({
  selector: '[ds-cris-layout-row]',
  templateUrl: './cris-layout-row.component.html',
  styleUrls: ['./cris-layout-row.component.scss']
})
export class CrisLayoutRowComponent implements OnInit {

  @Input() row: Row;

  constructor() { }

  ngOnInit(): void {
    console.log(this.row)
  }

}
