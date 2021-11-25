import { Component, Input } from '@angular/core';
import { Row } from '../../../core/layout/models/tab.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-cris-layout-row]',
  templateUrl: './cris-layout-row.component.html',
  styleUrls: ['./cris-layout-row.component.scss']
})
export class CrisLayoutRowComponent  {

  @Input() row: Row;

}
