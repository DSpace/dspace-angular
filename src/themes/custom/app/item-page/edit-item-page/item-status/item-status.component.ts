import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ItemOperationComponent } from '../../../../../../app/item-page/edit-item-page/item-operation/item-operation.component';
import { ItemStatusComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-status/item-status.component';
import {
  fadeIn,
  fadeInOut,
} from '../../../../../../app/shared/animations/fade';

@Component({
  selector: 'ds-item-status',
  // templateUrl: './item-status.component.html',
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-status/item-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf,
    AsyncPipe,
    NgIf,
    RouterLink,
    ItemOperationComponent,
    NgClass,
  ],
})
export class ItemStatusComponent extends BaseComponent {
}
