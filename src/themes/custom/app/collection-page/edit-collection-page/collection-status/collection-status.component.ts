import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CollectionOperationComponent } from 'src/app/collection-page/edit-collection-page/collection-operation/collection-operation.component';

import { CollectionStatusComponent as BaseComponent } from '../../../../../../app/collection-page/edit-collection-page/collection-status/collection-status.component';
import {
  fadeIn,
  fadeInOut,
} from '../../../../../../app/shared/animations/fade';

@Component({
  selector: 'ds-themed-item-status',
  // templateUrl: './item-status.component.html',
  templateUrl: '../../../../../../app/collection-page/edit-collection-page/collection-status/collection-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    CollectionOperationComponent,
    NgClass,
    RouterLink,
    TranslateModule,
  ],
})
export class CollectionStatusComponent extends BaseComponent {
}
