import { Component } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Tab } from '../../../core/layout/models/tab.model';
import { Item } from '../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { HostWindowService } from '../../../shared/host-window.service';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss']
})
@CrisLayoutPage(LayoutPage.VERTICAL)
export class CrisLayoutVerticalComponent {

  tabs: Tab[];

  item: Item;

  selectedTab$: BehaviorSubject<Tab> = new BehaviorSubject<Tab>(null);

  constructor(public windowService: HostWindowService) {
  }

  selectedTabChanged(tab: Tab) {
    this.selectedTab$.next(tab);
  }
}
