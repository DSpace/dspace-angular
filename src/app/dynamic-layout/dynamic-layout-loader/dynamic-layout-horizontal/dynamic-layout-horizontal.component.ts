import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { BehaviorSubject } from 'rxjs';

import { DsoEditMenuComponent } from '../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { dynamicLayoutPage } from '../../decorators/dynamic-layout-page.decorator';
import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { LayoutPage } from '../../enums/layout-page.enum';
import { DynamicLayoutPageDirective } from '../../models/dynamic-layout-page.directive';
import { DynamicLayoutNavbarComponent } from './dynamic-layout-navbar/dynamic-layout-navbar.component';

/**
 * Horizontal layout page component for the dynamic item page.
 * Renders tabs as a horizontal top navbar, with the selected tab's content
 * displayed below via {@link DynamicLayoutMatrixComponent}.
 */
@dynamicLayoutPage(LayoutPage.HORIZONTAL)
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
export class DynamicLayoutHorizontalComponent extends DynamicLayoutPageDirective {

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
