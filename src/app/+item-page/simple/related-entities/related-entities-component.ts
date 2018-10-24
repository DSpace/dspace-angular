import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import * as viewMode from '../../../shared/view-mode';

@Component({
  selector: 'ds-related-entities',
  styleUrls: ['./related-entities.component.scss'],
  templateUrl: './related-entities.component.html'
})
/**
 * This component is used for displaying relations between entities
 * It expects a list of entities to display and a label to put on top
 */
export class RelatedEntitiesComponent {
  /**
   * A list of entities to display
   */
  @Input() entities: Item[];

  /**
   * An i18n label to use as a title for the list (usually describes the relation)
   */
  @Input() label: string;

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  ElementViewMode = viewMode.ElementViewMode
}
