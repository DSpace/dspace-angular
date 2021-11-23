import { Component, OnInit, OnChanges } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Tab } from '../../../core/layout/models/tab.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../core/shared/item.model';
import { BehaviorSubject, Observable, Subject, of as observableOf } from 'rxjs';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss']
})
@CrisLayoutPage(LayoutPage.VERTICAL)
export class CrisLayoutVerticalComponent implements OnInit {

  tabs: Tab[];

  item: Item;

  selectedTab$: BehaviorSubject<Tab> = new BehaviorSubject<Tab>(null);

  constructor() {
  }

  ngOnInit(): void {
  }

  selectedTabChanged(tab : Tab){
    this.selectedTab$.next(tab);
  }
}
