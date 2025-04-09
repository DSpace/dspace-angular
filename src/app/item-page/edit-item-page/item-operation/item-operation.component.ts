import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ItemOperation } from './itemOperation.model';

@Component({
  selector: 'ds-item-operation',
  templateUrl: './item-operation.component.html',
  imports: [
    TranslateModule,
    RouterLink,
    NgbTooltipModule,
    NgIf,
  ],
  standalone: true,
})
/**
 * Operation that can be performed on an item
 */
export class ItemOperationComponent {

  @Input() operation: ItemOperation;

}
