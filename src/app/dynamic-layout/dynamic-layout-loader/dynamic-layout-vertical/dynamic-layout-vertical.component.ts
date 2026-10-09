import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { DsoEditMenuComponent } from '../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { HostWindowService } from '../../../shared/host-window.service';
import { dynamicLayoutPage } from '../../decorators/dynamic-layout-page.decorator';
import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { LayoutPage } from '../../enums/layout-page.enum';
import { DynamicLayoutPageDirective } from '../../models/dynamic-layout-page.directive';
import { DynamicLayoutNavbarComponent } from '../dynamic-layout-horizontal/dynamic-layout-navbar/dynamic-layout-navbar.component';
import { DynamicLayoutSidebarComponent } from './dynamic-layout-sidebar/dynamic-layout-sidebar.component';

/**
 * Vertical layout page component for the dynamic item page.
 * Renders tabs as a vertical sidebar on larger screens (falling back to a horizontal
 * navbar on small screens), with the selected tab's content displayed alongside.
 */
@dynamicLayoutPage(LayoutPage.VERTICAL)
@Component({
  selector: 'ds-dynamic-layout-vertical',
  templateUrl: './dynamic-layout-vertical.component.html',
  styleUrls: ['./dynamic-layout-vertical.component.scss'],
  imports: [
    AsyncPipe,
    DsoEditMenuComponent,
    DynamicLayoutMatrixComponent,
    DynamicLayoutNavbarComponent,
    DynamicLayoutSidebarComponent,
  ],
})
export class DynamicLayoutVerticalComponent extends DynamicLayoutPageDirective {

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
    super();
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  selectedTabChanged(tab: DynamicLayoutTab) {
    this.selectedTab$.next(tab);
  }
}
