import { Component, OnInit } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';

@Component({
  selector: 'ds-cris-layout-horizontal',
  templateUrl: './cris-layout-horizontal.component.html',
  styleUrls: ['./cris-layout-horizontal.component.scss']
})
@CrisLayoutPage(LayoutPage.HORIZONTAL)
export class CrisLayoutHorizontalComponent implements OnInit {

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
  }
  /* tslint:enable:no-empty */
}
