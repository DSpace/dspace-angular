import { Component, Input } from '@angular/core';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-item-type-badge',
  templateUrl: './item-type-badge.component.html'
})
export class ItemTypeBadgeComponent {
  @Input() object: ListableObject;
}
