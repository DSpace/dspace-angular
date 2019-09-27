import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { Component } from '@angular/core';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';
import { DEFAULT_ITEM_TYPE, rendersItemType } from '../../../items/item-type-decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@rendersItemType(DEFAULT_ITEM_TYPE, ViewMode.MetadataField, MetadataRepresentationType.PlainText)
// For now, authority controlled fields are rendered the same way as plain text fields
@rendersItemType(DEFAULT_ITEM_TYPE, ViewMode.MetadataField, MetadataRepresentationType.AuthorityControlled)
@Component({
  selector: 'ds-plain-text-metadata-list-element',
  templateUrl: './plain-text-metadata-list-element.component.html'
})
/**
 * A component for displaying MetadataRepresentation objects in the form of plain text
 * It will simply use the value retrieved from MetadataRepresentation.getValue() to display as plain text
 */
export class PlainTextMetadataListElementComponent extends MetadataRepresentationListElementComponent {
}
