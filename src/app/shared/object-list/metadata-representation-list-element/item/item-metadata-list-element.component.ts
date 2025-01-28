import { Component } from '@angular/core';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';

@Component({
  selector: 'ds-item-metadata-list-element',
  templateUrl: './item-metadata-list-element.component.html',
  standalone: true,
  imports: [ListableObjectComponentLoaderComponent],
})
/**
 * A component for displaying MetadataRepresentation objects in the form of items
 * It will send the MetadataRepresentation object along with ElementViewMode.SetElement to the ItemTypeSwitcherComponent,
 * which will in its turn decide how to render the item as metadata.
 */
export class ItemMetadataListElementComponent extends MetadataRepresentationListElementComponent {
  /**
   * The view-mode we're currently on
   * @type {ViewMode}
   */
  viewMode = ViewMode.ListElement;
}
