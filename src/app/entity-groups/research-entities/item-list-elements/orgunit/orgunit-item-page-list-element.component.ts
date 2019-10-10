import { Component } from '@angular/core';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';

@metadataRepresentationComponent('OrgUnit', MetadataRepresentationType.Item)
@Component({
  selector: 'ds-orgunit-item-page-list-element',
  templateUrl: './orgunit-item-page-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type OrgUnit
 */
export class OrgunitItemPageListElementComponent extends AbstractListableElementComponent<Item> {
}
