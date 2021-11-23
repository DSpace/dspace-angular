import { Component, OnInit } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Tab } from '../../../core/layout/models/tab.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-horizontal',
  templateUrl: './cris-layout-horizontal.component.html',
  styleUrls: ['./cris-layout-horizontal.component.scss']
})
@CrisLayoutPage(LayoutPage.HORIZONTAL)
export class CrisLayoutHorizontalComponent implements OnInit {

  /**
   * Tabs to render
   */
  tabs: Tab[];
  
  item: Item;

  constructor() {
  }

  ngOnInit(): void {
  }
}
