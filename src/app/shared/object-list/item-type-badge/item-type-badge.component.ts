import { Component, Input } from '@angular/core';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-item-type-badge',
  templateUrl: './item-type-badge.component.html'
})
export class ItemTypeBadgeComponent {
  @Input() object: SearchResult<DSpaceObject>;
}
