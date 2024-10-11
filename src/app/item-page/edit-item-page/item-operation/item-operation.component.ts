
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ItemOperation } from './itemOperation.model';

@Component({
  selector: 'ds-item-operation',
  templateUrl: './item-operation.component.html',
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
export class ItemOperationComponent {

  @Input() operation: ItemOperation;

}
