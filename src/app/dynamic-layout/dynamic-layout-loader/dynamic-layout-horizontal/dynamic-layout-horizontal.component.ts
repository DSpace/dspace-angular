import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { Item } from '@dspace/core/shared/item.model';
import { BehaviorSubject } from 'rxjs';

import { DsoEditMenuComponent } from '../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { DynamicLayoutNavbarComponent } from './dynamic-layout-navbar/dynamic-layout-navbar.component';

/**
 * Horizontal layout page component for the dynamic item page.
 * Renders tabs as a horizontal top navbar, with the selected tab's content
 * displayed below via {@link DynamicLayoutMatrixComponent}.
 */
@Component({
  selector: 'ds-dynamic-layout-horizontal',
  templateUrl: './dynamic-layout-horizontal.component.html',
  styleUrls: ['./dynamic-layout-horizontal.component.scss'],
  imports: [
    AsyncPipe,
    DsoEditMenuComponent,
    DynamicLayoutMatrixComponent,
    DynamicLayoutNavbarComponent,
  ],
})
export class DynamicLayoutHorizontalComponent {

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

  selectedTabChanged(tab: DynamicLayoutTab) {
    this.selectedTab$.next(tab);
  }
}
