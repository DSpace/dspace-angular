import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { HostWindowService } from '../../../shared/host-window.service';
import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { DynamicLayoutNavbarComponent } from '../dynamic-layout-horizontal/dynamic-layout-navbar/dynamic-layout-navbar.component';
import { DynamicLayoutSidebarComponent } from './dynamic-layout-sidebar/dynamic-layout-sidebar.component';

@Component({
  selector: 'ds-dynamic-layout-vertical',
  templateUrl: './dynamic-layout-vertical.component.html',
  styleUrls: ['./dynamic-layout-vertical.component.scss'],
  imports: [
    AsyncPipe,
    DynamicLayoutMatrixComponent,
    DynamicLayoutNavbarComponent,
    DynamicLayoutSidebarComponent,
  ],
})
export class DynamicLayoutVerticalComponent {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Tabs to render
   */
  @Input() tabs: DynamicLayoutTab[];

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;

  /**
   * leadingTabs to understand if to show navbar
   */
  @Input() leadingTabs: DynamicLayoutTab[];


  selectedTab$: BehaviorSubject<DynamicLayoutTab> = new BehaviorSubject<DynamicLayoutTab>(null);
  isXsOrSm$: Observable<boolean>;

  constructor(public windowService: HostWindowService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  selectedTabChanged(tab: DynamicLayoutTab) {
    this.selectedTab$.next(tab);
  }
}
