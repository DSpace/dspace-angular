import { Component, OnInit } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss']
})
@CrisLayoutPage(LayoutPage.VERTICAL)
export class CrisLayoutVerticalComponent implements OnInit {

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
  }
  /* tslint:enable:no-empty */

}
