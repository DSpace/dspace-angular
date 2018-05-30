import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import * as viewMode from '../../../shared/view-mode';

@Component({
  selector: 'ds-related-entities',
  styleUrls: ['./related-entities.component.scss'],
  templateUrl: './related-entities.component.html'
})
export class RelatedEntitiesComponent {
  @Input() entities: Item[];
  @Input() label: string;
  ElementViewMode = viewMode.ElementViewMode
}
