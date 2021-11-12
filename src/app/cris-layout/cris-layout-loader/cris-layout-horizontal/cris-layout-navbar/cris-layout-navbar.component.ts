import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';

@Component({
  selector: 'ds-cris-layout-navbar',
  templateUrl: './cris-layout-navbar.component.html',
  styleUrls: ['./cris-layout-navbar.component.scss']
})
export class CrisLayoutNavbarComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
  }
  /* tslint:enable:no-empty */

  getTabSelected(tab){
    console.log(tab);
  }
}
