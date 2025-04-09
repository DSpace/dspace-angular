import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CrisLayoutTab } from '../../../core/layout/models/tab.model';
import { Item } from '../../../core/shared/item.model';
import { ContextMenuComponent } from '../../../shared/context-menu/context-menu.component';
import { CrisLayoutMatrixComponent } from '../../cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutNavbarComponent } from './cris-layout-navbar/cris-layout-navbar.component';

@Component({
  selector: 'ds-cris-layout-horizontal',
  templateUrl: './cris-layout-horizontal.component.html',
  styleUrls: ['./cris-layout-horizontal.component.scss'],
  standalone: true,
  imports: [
    CrisLayoutNavbarComponent,
    NgIf,
    ContextMenuComponent,
    CrisLayoutMatrixComponent,
    AsyncPipe,
  ],
})
export class CrisLayoutHorizontalComponent {

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

  selectedTabChanged(tab: CrisLayoutTab) {
    this.selectedTab$.next(tab);
  }
}
