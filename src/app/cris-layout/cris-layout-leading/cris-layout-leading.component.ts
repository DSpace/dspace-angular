import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-leading',
  templateUrl: './cris-layout-leading.component.html',
  styleUrls: ['./cris-layout-leading.component.scss']
})
export class CrisLayoutLeadingComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tab: Tab;

  @Input() item: Item;

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
  }
  /* tslint:enable:no-empty */


}
