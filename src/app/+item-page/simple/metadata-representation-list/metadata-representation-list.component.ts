import { Component, Input } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemViewMode } from '../../../shared/items/item-type-decorator';

@Component({
  selector: 'ds-metadata-representation-list',
  templateUrl: './metadata-representation-list.component.html'
})
/**
 * This component is used for displaying metadata
 * It expects a list of MetadataRepresentation objects and a label to put on top of the list
 */
export class MetadataRepresentationListComponent {
  /**
   * A list of metadata-representations to display
   */
  @Input() representations: MetadataRepresentation[];

  /**
   * An i18n label to use as a title for the list
   */
  @Input() label: string;

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  viewMode = ItemViewMode.Metadata;
}
