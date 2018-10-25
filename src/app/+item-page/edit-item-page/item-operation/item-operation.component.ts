import {Component, Input} from '@angular/core';
import {ItemOperation} from './itemOperation.model';

@Component({
  selector: 'ds-item-operation',
  templateUrl: './item-operation.component.html'
})

export class ItemOperationComponent {

  @Input() operation: ItemOperation;

}
