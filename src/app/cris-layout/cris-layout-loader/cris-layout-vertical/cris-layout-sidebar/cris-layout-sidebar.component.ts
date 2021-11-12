import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';

@Component({
  selector: 'ds-cris-layout-sidebar',
  templateUrl: './cris-layout-sidebar.component.html',
  styleUrls: ['./cris-layout-sidebar.component.scss']
})
export class CrisLayoutSidebarComponent implements OnInit {

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
