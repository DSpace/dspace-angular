import {
  Component,
  Input,
} from '@angular/core';

import { ItemOperation } from './itemOperation.model';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ds-item-operation',
  templateUrl: './item-operation.component.html',
  imports: [
    TranslateModule,
    RouterLink,
    NgbTooltipModule,
    NgIf
  ],
  standalone: true
})
/**
 * Operation that can be performed on an item
 */
export class ItemOperationComponent {

  @Input() operation: ItemOperation;

}
