
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { CollectionOperation } from './collectionOperation.model';

@Component({
  selector: 'ds-collection-operation',
  templateUrl: './collection-operation.component.html',
  imports: [
    BtnDisabledDirective,
    NgbTooltipModule,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Operation that can be performed on an item
 */
export class CollectionOperationComponent {

  @Input() operation: CollectionOperation;

}
