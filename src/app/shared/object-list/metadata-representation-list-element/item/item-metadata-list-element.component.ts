import * as viewMode from '../../../view-mode';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { Component } from '@angular/core';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';
import { DEFAULT_ITEM_TYPE, rendersItemType } from '../../../items/item-type-decorator';
import { VIEW_MODE_METADATA } from '../../../../+item-page/simple/metadata-representation-list/metadata-representation-list.component';
import { VIEW_MODE_ELEMENT } from '../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType(DEFAULT_ITEM_TYPE, VIEW_MODE_METADATA, MetadataRepresentationType.Item)
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
  viewMode = VIEW_MODE_ELEMENT;
}
