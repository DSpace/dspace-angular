import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { CrisLayoutTab } from '../../../core/layout/models/tab.model';
import { Item } from '../../../core/shared/item.model';
import { ContextMenuComponent } from '../../../shared/context-menu/context-menu.component';
import { HostWindowService } from '../../../shared/host-window.service';
import { CrisLayoutMatrixComponent } from '../../cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutNavbarComponent } from '../cris-layout-horizontal/cris-layout-navbar/cris-layout-navbar.component';
import { CrisLayoutSidebarComponent } from './cris-layout-sidebar/cris-layout-sidebar.component';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    CrisLayoutSidebarComponent,
    ContextMenuComponent,
    CrisLayoutMatrixComponent,
    CrisLayoutNavbarComponent,
    AsyncPipe,
  ],
})
export class CrisLayoutVerticalComponent {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Tabs to render
   */
  @Input() tabs: CrisLayoutTab[];

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;

  /**
   * leadingTabs to understand if to show navbar
   */
  @Input() leadingTabs: CrisLayoutTab[];


  selectedTab$: BehaviorSubject<CrisLayoutTab> = new BehaviorSubject<CrisLayoutTab>(null);
  isXsOrSm$: Observable<boolean>;

  constructor(public windowService: HostWindowService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  selectedTabChanged(tab: CrisLayoutTab) {
    this.selectedTab$.next(tab);
  }
}
