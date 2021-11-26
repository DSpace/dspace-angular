import { Component } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Tab } from '../../../core/layout/models/tab.model';
import { Item } from '../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ds-cris-layout-horizontal',
  templateUrl: './cris-layout-horizontal.component.html',
  styleUrls: ['./cris-layout-horizontal.component.scss']
})
@CrisLayoutPage(LayoutPage.HORIZONTAL)
export class CrisLayoutHorizontalComponent {

  /**
   * Tabs to render
   */
  tabs: Tab[];

  item: Item;

  selectedTab$: BehaviorSubject<Tab> = new BehaviorSubject<Tab>(null);

  selectedTabChanged(tab: Tab) {
    this.selectedTab$.next(tab);
  }
}
