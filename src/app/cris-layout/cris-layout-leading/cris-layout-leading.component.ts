import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu.component';
import { CrisLayoutMatrixComponent } from '../cris-layout-matrix/cris-layout-matrix.component';

@Component({
  selector: 'ds-cris-layout-leading',
  templateUrl: './cris-layout-leading.component.html',
  styleUrls: ['./cris-layout-leading.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ContextMenuComponent,
    CrisLayoutMatrixComponent,
  ],
})
export class CrisLayoutLeadingComponent {

  /**
   * Tabs to render
   */
  @Input() tab: CrisLayoutTab;

  /**
   * The related item
   */
  @Input() item: Item;

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;
}
