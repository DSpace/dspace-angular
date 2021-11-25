import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-matrix',
  templateUrl: './cris-layout-matrix.component.html',
  styleUrls: ['./cris-layout-matrix.component.scss']
})
export class CrisLayoutMatrixComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tab: Tab;

  /**
   * Tabs to render
   */
  @Input() row;

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
    console.log(this.tab,this.item);
  }
  /* tslint:enable:no-empty */

}
