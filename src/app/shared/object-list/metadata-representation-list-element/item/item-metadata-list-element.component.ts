import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { Component } from '@angular/core';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';
import { DEFAULT_ITEM_TYPE, ItemViewMode, rendersItemType } from '../../../items/item-type-decorator';

@rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Metadata, MetadataRepresentationType.Item)
@Component({
  selector: 'ds-item-metadata-list-element',
  templateUrl: './item-metadata-list-element.component.html'
})
/**
 * A component for displaying MetadataRepresentation objects in the form of items
 * It will send the MetadataRepresentation object along with ElementViewMode.SetElement to the ItemTypeSwitcherComponent,
 * which will in his turn decide how to render the item as metadata.
 */
export class ItemMetadataListElementComponent extends MetadataRepresentationListElementComponent {
  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  viewMode = ItemViewMode.Element;
}
